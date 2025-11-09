import { config } from 'dotenv';
config(); // Carrega as variáveis de ambiente do .env

import { db } from "../server/db";
import { eq } from "drizzle-orm";
import { users } from "../shared/schema";

async function makeAdmin(email: string) {
  try {
    const result = await db
      .update(users)
      .set({ isAdmin: true })
      .where(eq(users.email, email))
      .returning({ id: users.id, email: users.email, isAdmin: users.isAdmin });

    if (result.length === 0) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }

    console.log("Successfully made user an admin:");
    console.log(result[0]);
  } catch (error) {
    console.error("Error making user admin:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error("Please provide an email address as an argument");
  console.error("Usage: npm run make-admin example@email.com");
  process.exit(1);
}

makeAdmin(email);