# Overview

TRANSFÁCIL is a student transportation platform for universities in Angola. The application connects students with transportation services through subscription-based bus transport and peer-to-peer ridesharing. Students can purchase weekly or monthly subscriptions for dedicated bus routes, request and offer carpools, track vehicles in real-time, and manage payments through various local payment methods.

# Recent Changes

## Fase 1 - Correções Imediatas (10 Nov 2025)

**Bugs Críticos Corrigidos:**
1. **Erro de publicação de boleia**: Removido código duplicado na rota POST /api/rides que estava misturando lógica de booking
2. **Imports inválidos**: Removido import de 'notifications' que não existe no server/routes.ts
3. **Erros de TypeScript**: Adicionados tipos genéricos em todas as queries (Student, Schedule[], Booking[], Subscription) - 19 diagnostics LSP resolvidos

**Novos Recursos:**
1. **Foto de perfil na home**: Avatar agora exibe profileImageUrl do usuário ou iniciais como fallback
2. **Nova sessão Eventos**: Criada página /events com lista de eventos universitários, sistema de reserva de transporte (ida, volta, ida-e-volta), e integração com bottom navigation

**Status**: ✅ Fase 1 completamente aprovada pelo arquiteto - todos os erros de compilação e LSP resolvidos

# User Preferences

Preferred communication style: Simple, everyday language.
All interfaces in Portuguese (pt-PT/pt-AO).
Mobile-first design with bottom navigation pattern.

# System Architecture

## Frontend Architecture

**React SPA with Vite**: The frontend is built as a single-page application using React 18+ with TypeScript, bundled via Vite for fast development and optimized production builds. The application uses Wouter for client-side routing instead of React Router.

**UI Component System**: Built on Radix UI primitives with shadcn/ui components styled using Tailwind CSS. The design system uses CSS variables for theming with support for light/dark modes. All UI components follow the "new-york" style variant with a primary brand color of lime green (hsl(78, 71%, 57%)).

**State Management**: TanStack Query (React Query) handles server state management, data fetching, and caching. The query client is configured with infinite stale time and disabled automatic refetching for predictable data behavior.

**Mobile-First Design**: The application is optimized for mobile devices with a bottom navigation pattern. Responsive breakpoints are managed through Tailwind with a mobile breakpoint at 768px.

## Backend Architecture

**Express.js Server**: Node.js backend using Express with TypeScript, running in ESM module mode. The server handles API routes, authentication middleware, and serves the Vite-built frontend in production.

**API Structure**: RESTful API design with route groups for authentication (`/api/auth/*`), student profiles (`/api/student/*`), subscriptions (`/api/subscription/*`), rides (`/api/rides/*`), bookings (`/api/bookings/*`), and admin operations (`/api/admin/*`).

**Session Management**: Express-session with PostgreSQL session storage using connect-pg-simple. Sessions are configured with a 7-day TTL, secure cookies, and HTTP-only flags.

**Development vs Production**: Vite dev server runs in middleware mode during development. Production builds compile both frontend (Vite) and backend (esbuild) separately, with the backend serving static frontend assets.

## Database Layer

**PostgreSQL with Drizzle ORM**: The application uses PostgreSQL as the primary database, accessed through Drizzle ORM with the Neon serverless driver. WebSocket connections are enabled for serverless environments.

**Schema Design**: Core entities include users (auth), students (profiles), universities, subscription plans, subscriptions, routes, buses, schedules, bookings, rides (carpools), and ride requests. Sessions table stores authentication state.

**Type Safety**: Drizzle-Zod integration generates Zod schemas from database schema for runtime validation. Insert/update schemas are created automatically for API input validation.

## Authentication & Authorization

**Replit Auth Integration**: OAuth-based authentication using Replit's OpenID Connect provider. The auth strategy uses the openid-client library with Passport.js strategy pattern.

**User Management**: Users are automatically created/updated on successful authentication. The system extracts user claims (sub, email, name, profile image) and maintains user records in PostgreSQL.

**Protected Routes**: API endpoints use `isAuthenticated` middleware to verify session validity. Unauthorized requests return 401 status codes, which the frontend handles by redirecting to login.

## External Dependencies

**Payment Processing**: Stripe integration is configured for subscription payments (`@stripe/stripe-js`, `@stripe/react-stripe-js`), though the application also references local payment methods like Multicaixa for the Angolan market.

**Database Hosting**: Neon serverless PostgreSQL for cloud-hosted database with connection pooling support. Environment variable `DATABASE_URL` must be configured.

**Development Tools**: Replit-specific integrations include the dev banner, runtime error overlay modal, and cartographer plugin for enhanced debugging in the Replit environment.

**UI Libraries**: Comprehensive set of Radix UI primitives for accessible components (dialogs, dropdowns, tooltips, etc.). Additional UI libraries include cmdk for command palette, date-fns for date manipulation, and lucide-react for icons.

**Form Management**: React Hook Form with Zod resolvers for type-safe form validation aligned with database schemas.

**Real-time Features**: The architecture supports WebSocket connections through the Neon database driver, enabling potential real-time tracking features for bus/ride locations.