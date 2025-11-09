import "./loadEnv";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import pgSession from "connect-pg-simple";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Session configuration
const SESSION_SECRET = process.env.SESSION_SECRET || 'development_secret';
const PostgresqlStore = pgSession(session);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Admin routes
import adminRouter from "./routes/admin";
app.use("/api/admin", adminRouter);

// Configure session middleware with PostgreSQL store
app.use(session({
  store: new PostgresqlStore({
    pool,
    tableName: 'sessions'
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Quick diagnostic: log whether session object is present on incoming API requests
app.use((req, _res, next) => {
  if (req.path.startsWith('/api')) {
    try {
      // eslint-disable-next-line no-console
      console.log(`[session-debug] path=${req.path} hasSession=${!!(req as any).session}`);
    } catch (e) {}
  }
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000. Use platform-aware listen options to
  // avoid `ENOTSUP` errors on platforms that don't support reusePort or
  // binding the wildcard address the same way (some Windows environments).
  const port = 5000;

  // Bind explicitly to 127.0.0.1 for local development so we know the address
  // being used and avoid any odd behavior with wildcard bindings on some
  // Windows environments. Also log the actual address object for debugging.
  server.listen(port, "127.0.0.1", () => {
    const addr = server.address();
    log(`serving on port ${port} - address: ${JSON.stringify(addr)}`);

    // Diagnostic: after a short delay, print whether the process still has
    // open handles (helps detect cases where the process exits immediately).
    setTimeout(() => {
      try {
        log(`post-listen check: server.address() = ${JSON.stringify(server.address())}`);
      } catch (e) {
        log(`post-listen check failed: ${(e as Error).message}`);
      }
    }, 500);
  });
})();
