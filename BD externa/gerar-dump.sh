
#!/bin/bash

# ============================================================
# Script para gerar dump completo do banco de dados TransFácil
# ============================================================
# 
# Este script gera um arquivo de backup completo do PostgreSQL
# contendo estrutura e dados do banco de dados.
#
# Uso: ./gerar-dump.sh
# ============================================================

# Carregar variáveis de ambiente
if [ -f "../.env" ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
else
    echo "❌ Arquivo .env não encontrado!"
    exit 1
fi

# Verificar se DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL não está definida no arquivo .env"
    exit 1
fi

# Extrair informações da URL do banco
DB_URL=$DATABASE_URL

# Nome do arquivo de dump
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DUMP_FILE="transfacil_dump_${TIMESTAMP}.backup"

echo "📦 Gerando dump do banco de dados TransFácil..."
echo "📁 Arquivo de saída: $DUMP_FILE"

# Gerar dump usando pg_dump
# Formato custom (-Fc) permite restauração seletiva e compressão
pg_dump "$DB_URL" \
    --format=custom \
    --compress=9 \
    --verbose \
    --file="$DUMP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Dump gerado com sucesso!"
    echo "📊 Tamanho do arquivo: $(du -h "$DUMP_FILE" | cut -f1)"
    echo ""
    echo "Para restaurar este dump em outro ambiente PostgreSQL, use:"
    echo "pg_restore -d nome_do_banco --clean --if-exists $DUMP_FILE"
else
    echo "❌ Erro ao gerar dump do banco de dados"
    exit 1
fi
