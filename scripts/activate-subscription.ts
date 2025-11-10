
import { config } from 'dotenv';
config();

import { db } from "../server/db";
import { users, students, subscriptions } from "@shared/schema";
import { eq } from "drizzle-orm";

async function activateSubscription() {
  try {
    const email = "caetano@gmail.com";
    
    console.log(`Buscando usuário: ${email}`);
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      console.error("❌ Usuário não encontrado");
      process.exit(1);
    }

    console.log("✓ Usuário encontrado:", user.id);

    const student = await db.query.students.findFirst({
      where: eq(students.userId, user.id)
    });

    if (!student) {
      console.error("❌ Perfil de estudante não encontrado");
      process.exit(1);
    }

    console.log("✓ Estudante encontrado:", student.id);

    // Verificar se já tem assinatura ativa
    const existingSubscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.studentId, student.id)
    });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30); // 30 dias

    if (existingSubscription) {
      console.log("Atualizando assinatura existente...");
      await db
        .update(subscriptions)
        .set({
          planId: 2, // Plano mensal
          startDate,
          endDate,
          isActive: true,
          tripsRemaining: null // Ilimitado
        })
        .where(eq(subscriptions.id, existingSubscription.id));
    } else {
      console.log("Criando nova assinatura...");
      await db.insert(subscriptions).values({
        studentId: student.id,
        planId: 2, // Plano mensal
        startDate,
        endDate,
        isActive: true,
        tripsRemaining: null // Ilimitado
      });
    }

    console.log("✅ Assinatura ativada com sucesso!");
    console.log(`   Plano: Mensal (ilimitado)`);
    console.log(`   Início: ${startDate.toLocaleDateString('pt-AO')}`);
    console.log(`   Fim: ${endDate.toLocaleDateString('pt-AO')}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao ativar assinatura:", error);
    process.exit(1);
  }
}

activateSubscription();
