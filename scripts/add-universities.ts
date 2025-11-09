import { config } from 'dotenv';
config();

import { db } from "../server/db";
import { universities } from "../shared/schema";

const defaultUniversities = [
  {
    name: "Universidade Agostinho Neto",
    code: "UAN",
    address: "Luanda, Angola"
  },
  {
    name: "Universidade Católica de Angola",
    code: "UCAN",
    address: "Luanda, Angola"
  },
  {
    name: "Universidade Técnica de Angola",
    code: "UTANGA",
    address: "Luanda, Angola"
  },
  {
    name: "Universidade Metodista de Angola",
    code: "UMA",
    address: "Luanda, Angola"
  },
  {
    name: "Universidade Independente de Angola",
    code: "UNIA",
    address: "Luanda, Angola"
  }
];

async function addDefaultUniversities() {
  try {
    // Verifica se já existem universidades
    const existing = await db.select().from(universities);
    if (existing.length > 0) {
      console.log("Já existem universidades cadastradas. Pulando a inserção.");
      return;
    }

    // Insere as universidades padrão
    const result = await db.insert(universities).values(defaultUniversities).returning();
    
    console.log("Universidades adicionadas com sucesso:");
    console.log(result);
  } catch (error) {
    console.error("Erro ao adicionar universidades:", error);
    process.exit(1);
  }

  process.exit(0);
}

addDefaultUniversities();