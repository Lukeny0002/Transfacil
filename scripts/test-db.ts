import { config } from 'dotenv';
config();

// Configuração do banco de dados
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:123456789@localhost:5432/transfacil';

console.log('DATABASE_URL:', DATABASE_URL);

// Tentar conectar ao banco
import { Pool } from 'pg';

async function testConnection() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  
  try {
    const client = await pool.connect();
    console.log('Conexão bem sucedida!');
    
    // Testar se podemos fazer uma query
    const result = await client.query('SELECT current_database()');
    console.log('Banco de dados atual:', result.rows[0].current_database);
    
    client.release();
  } catch (err) {
    console.error('Erro ao conectar:', err);
  } finally {
    await pool.end();
  }
}

testConnection();