
import { config } from 'dotenv';
config();

import { db } from "../server/db";
import { events, eventBookings, paymentProofs } from "@shared/schema";

async function clearEvents() {
  try {
    console.log("Removendo comprovantes de pagamento...");
    await db.delete(paymentProofs);
    
    console.log("Removendo reservas de eventos...");
    await db.delete(eventBookings);
    
    console.log("Removendo eventos...");
    await db.delete(events);
    
    console.log("✅ Todos os eventos foram removidos com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao remover eventos:", error);
    process.exit(1);
  }
}

clearEvents();
