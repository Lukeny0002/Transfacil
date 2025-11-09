import { config } from 'dotenv';
config();

import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function createUserIfNotExists(email: string) {
  try {
    // Verifica se o usuário já existe
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      console.log("Usuário já existe:", existingUser[0]);
      return existingUser[0];
    }

    // Cria um novo usuário
    const result = await db.insert(users)
      .values({
        id: crypto.randomUUID(), // Gera um ID único
        email: email,
        firstName: "Admin",
        lastName: "User",
        authType: "local",
        isActive: true
      })
      .returning();

    console.log("Novo usuário criado:", result[0]);
    return result[0];
  } catch (error) {
    console.error("Erro ao criar/verificar usuário:", error);
    process.exit(1);
  }
}

// Pega o email do argumento da linha de comando
const email = process.argv[2];
if (!email) {
  console.error("Por favor, forneça um endereço de email como argumento");
  console.error("Uso: npm run create-user seu@email.com");
  process.exit(1);
}

createUserIfNotExists(email);