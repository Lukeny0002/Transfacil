
# BD Externa - Backup do Banco de Dados TransFácil

Esta pasta contém os arquivos necessários para backup e restauração do banco de dados PostgreSQL do sistema TransFácil.

## 📁 Arquivos Disponíveis

### 1. `schema-completo.sql`
**Arquivo SQL com o schema completo do banco de dados**

- ✅ Contém todas as definições de tabelas (`CREATE TABLE`)
- ✅ Inclui índices, constraints e relacionamentos
- ✅ Contém dados iniciais (INSERTs) para tabelas de referência (universidades e planos)
- ✅ Fácil de executar em qualquer ambiente PostgreSQL
- ✅ Ideal para criar a estrutura do banco em um novo ambiente

**Como usar:**
```bash
# Conectar ao PostgreSQL e executar o script
psql -U seu_usuario -d transfacil -f schema-completo.sql

# Ou executar diretamente da URL
psql "postgresql://usuario:senha@host:5432/transfacil" -f schema-completo.sql
```

### 2. `gerar-dump.sh`
**Script para gerar dump completo do PostgreSQL**

- ✅ Gera backup completo com estrutura E dados
- ✅ Usa formato custom do PostgreSQL (comprimido)
- ✅ Mantém permissões e configurações exatas
- ✅ Pode ser restaurado facilmente com `pg_restore`
- ✅ Nome do arquivo inclui timestamp para versionamento

**Como usar:**
```bash
# Dar permissão de execução (primeira vez)
chmod +x gerar-dump.sh

# Executar o script
./gerar-dump.sh

# Será gerado um arquivo como: transfacil_dump_20250110_235959.backup
```

**Como restaurar o dump:**
```bash
# Restaurar em um banco existente (limpa dados anteriores)
pg_restore -d transfacil --clean --if-exists transfacil_dump_TIMESTAMP.backup

# Restaurar com URL de conexão
pg_restore "postgresql://usuario:senha@host:5432/transfacil" --clean --if-exists transfacil_dump_TIMESTAMP.backup

# Restaurar apenas a estrutura (sem dados)
pg_restore -d transfacil --schema-only transfacil_dump_TIMESTAMP.backup

# Restaurar apenas os dados (sem estrutura)
pg_restore -d transfacil --data-only transfacil_dump_TIMESTAMP.backup
```

## 🔄 Diferenças Entre os Arquivos

| Característica | schema-completo.sql | dump gerado (.backup) |
|----------------|---------------------|----------------------|
| **Estrutura do BD** | ✅ Sim | ✅ Sim |
| **Dados** | ⚠️ Apenas dados iniciais | ✅ Todos os dados |
| **Formato** | SQL puro (texto) | Custom PostgreSQL (binário) |
| **Tamanho** | Pequeno (~15-20 KB) | Varia com dados |
| **Portabilidade** | Alta (qualquer PostgreSQL) | Alta (PostgreSQL específico) |
| **Compressão** | Não | Sim (nível 9) |
| **Restauração Seletiva** | Não | Sim |
| **Ideal para** | Criar novo ambiente | Backup completo |

## 📋 Estrutura do Banco de Dados

O banco TransFácil possui as seguintes tabelas principais:

### Autenticação e Usuários
- `sessions` - Sessões de autenticação
- `users` - Usuários do sistema

### Perfis
- `students` - Perfis de estudantes
- `drivers` - Perfis de motoristas
- `vehicles` - Veículos cadastrados

### Universidades e Planos
- `universities` - Universidades cadastradas
- `subscription_plans` - Planos de assinatura
- `subscriptions` - Assinaturas ativas

### Rotas e Transportes
- `routes` - Rotas de ônibus
- `buses` - Ônibus cadastrados
- `schedules` - Horários de ônibus

### Reservas e Viagens
- `bookings` - Reservas de viagens
- `bus_reservations` - Reservas de assentos

### Carpool (Caronas)
- `rides` - Caronas oferecidas
- `ride_requests` - Solicitações de carona

### Eventos
- `events` - Eventos universitários
- `event_bookings` - Reservas de transporte para eventos
- `payment_proofs` - Comprovativos de pagamento

## 🔐 Segurança

⚠️ **IMPORTANTE**: Os arquivos de dump contêm dados sensíveis, incluindo:
- Informações de usuários
- Dados de estudantes
- Informações de pagamento
- Hashes de senhas

**Boas práticas:**
- ❌ Nunca commitar dumps no Git
- ✅ Armazenar dumps em local seguro
- ✅ Criptografar dumps antes de transferir
- ✅ Fazer backups regulares (diário/semanal)
- ✅ Testar restauração periodicamente

## 📅 Rotina de Backup Recomendada

1. **Diário**: Gerar dump completo (automático)
2. **Semanal**: Verificar integridade dos backups
3. **Mensal**: Testar restauração em ambiente de teste
4. **Antes de updates**: Sempre fazer backup antes de atualizar o sistema

## 🆘 Troubleshooting

### Erro: "pg_dump: command not found"
```bash
# Instalar PostgreSQL client tools
# Ubuntu/Debian:
sudo apt-get install postgresql-client

# macOS:
brew install postgresql
```

### Erro: "permission denied"
```bash
# Dar permissão ao script
chmod +x gerar-dump.sh
```

### Erro ao restaurar: "role does not exist"
```bash
# Criar o usuário antes de restaurar
createuser -U postgres nome_do_usuario
```

## 📞 Suporte

Para questões sobre backup e restauração, consulte:
- Documentação PostgreSQL: https://www.postgresql.org/docs/
- Documentação Neon (provider usado): https://neon.tech/docs/
