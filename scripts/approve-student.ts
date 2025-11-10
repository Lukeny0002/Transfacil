
import { config } from 'dotenv';
config();

import { db } from '../server/db';
import { students, users } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function approveStudent(email: string) {
  try {
    // Buscar o usuário pelo email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      console.error(`❌ Usuário com email ${email} não encontrado`);
      process.exit(1);
    }

    console.log(`✓ Usuário encontrado: ${user.firstName} ${user.lastName}`);

    // Buscar o estudante associado a este usuário
    const student = await db.query.students.findFirst({
      where: eq(students.userId, user.id)
    });

    if (!student) {
      console.error(`❌ Perfil de estudante não encontrado para o usuário ${email}`);
      process.exit(1);
    }

    console.log(`✓ Estudante encontrado: ${student.fullName}`);
    console.log(`  Status atual: ${student.approvalStatus}`);

    if (student.approvalStatus === 'approved') {
      console.log(`⚠ Este estudante já está aprovado`);
      process.exit(0);
    }

    // Aprovar o estudante
    const [updatedStudent] = await db
      .update(students)
      .set({
        approvalStatus: 'approved',
        approvedBy: user.id, // O próprio ID do admin que está executando
        approvedAt: new Date(),
      })
      .where(eq(students.id, student.id))
      .returning();

    console.log(`✅ Estudante aprovado com sucesso!`);
    console.log(`  Nome: ${updatedStudent.fullName}`);
    console.log(`  Email: ${email}`);
    console.log(`  Status: ${updatedStudent.approvalStatus}`);
    console.log(`  Aprovado em: ${updatedStudent.approvedAt}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao aprovar estudante:', error);
    process.exit(1);
  }
}

// Executar com o email fornecido como argumento
const email = process.argv[2];

if (!email) {
  console.error('❌ Por favor, forneça um email como argumento');
  console.error('Uso: npx tsx scripts/approve-student.ts email@exemplo.com');
  process.exit(1);
}

approveStudent(email);
