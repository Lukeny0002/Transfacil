import "../server/loadEnv";
import { db, pool } from "../server/db";
import { universities, subscriptionPlans } from "@shared/schema";

async function seed() {
  try {
    console.log("Seeding database...");

    const uniValues = [
      {
        name: "Universidade de Exemplo",
        code: "UEX",
        address: "Rua Exemplo, 123",
      },
      {
        name: "Universidade Federal Teste",
        code: "UFT",
        address: "Av. Teste, 456",
      },
    ];

    const planValues = [
      {
        name: "Plano Mensal Estudante",
        duration: "monthly",
        price: "9.99",
        features: { ridesPerMonth: 30, prioritySupport: false },
        isActive: true,
      },
      {
        name: "Plano Semanal Gratuito",
        duration: "weekly",
        price: "0",
        features: { ridesPerWeek: 5 },
        isActive: true,
      },
    ];

    // Use ON CONFLICT DO NOTHING so the seed can be re-run without failing
    const insertedUnis = await db
      .insert(universities)
      .values(uniValues)
      .onConflictDoNothing()
      .returning();
    if (insertedUnis.length > 0) {
      console.log("Universities inserted:", insertedUnis.map((u: any) => u.name));
    } else {
      console.log("Universities already present — skipped inserts");
    }

    const insertedPlans = await db
      .insert(subscriptionPlans)
      .values(planValues)
      .onConflictDoNothing()
      .returning();
    if (insertedPlans.length > 0) {
      console.log("Subscription plans inserted:", insertedPlans.map((p: any) => p.name));
    } else {
      console.log("Subscription plans already present — skipped inserts");
    }

    console.log("Seeding finished.");
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  } finally {
    // Do not call pool.end() here: if the server is running in another
    // process it shares the same DB and closing the pool may interfere.
  }
}

seed();
