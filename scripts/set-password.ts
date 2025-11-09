import { config } from 'dotenv';
config();

import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../server/localAuth";

async function setUserPassword(email: string, password: string) {
  try {
    // Hash a senha
    const passwordHash = await hashPassword(password);

    // Atualiza o usuário com a nova senha
    const result = await db
      .update(users)
      .set({ 
        passwordHash,
        authType: 'local' // Garante que o tipo de autenticação é local
      })
      .where(eq(users.email, email))
      .returning({ 
        id: users.id, 
        email: users.email, 
        authType: users.authType 
      });

    if (result.length === 0) {
      console.error(`Nenhum usuário encontrado com o email: ${email}`);
      process.exit(1);
    }

    console.log("Senha definida com sucesso para o usuário:", result[0]);
  } catch (error) {
    console.error("Erro ao definir senha:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Pega email e senha dos argumentos da linha de comando
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Por favor, forneça email e senha como argumentos");
  console.error("Uso: npm run set-password seu@email.com senha123");
  process.exit(1);
}

setUserPassword(email, password);