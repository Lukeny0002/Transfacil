
# 📋 PENDÊNCIAS DO TRANSFÁCIL

Este documento lista todas as funcionalidades que ainda precisam ser implementadas para o app estar 100% funcional, sem telas estáticas e com todas as features completas.

---

## 🚨 CRÍTICO - Banco de Dados

### ❌ Banco de dados não existe
**Status:** O erro mostra `relation "universities" does not exist`

**Solução:**
```bash
# 1. Executar o schema SQL
psql $DATABASE_URL -f "BD externa/schema-completo.sql"

# OU se DATABASE_URL não estiver configurada:
# Configurar a variável de ambiente DATABASE_URL no Secrets
# Depois executar o schema
```

**Impacto:** Nada funciona sem o banco de dados configurado

---

## 🔴 ALTA PRIORIDADE

### 1. Sistema de Pagamentos Real
**Status:** ❌ Não implementado

**O que falta:**
- Integração com Express Multicaixa API
- Processamento de pagamentos via Referência Multicaixa
- Webhook para confirmação automática de pagamentos
- Upload e validação de comprovativos de pagamento
- Sistema de validação manual de comprovativos pelo admin

**Páginas afetadas:**
- `/subscription` - Tela estática, não processa pagamentos reais
- `/payment-center` - Apenas mostra valores mockados

**Arquivos a criar/modificar:**
- `server/routes/payments.ts` - Rotas de pagamento
- `server/integrations/multicaixa.ts` - Integração Multicaixa
- `server/storage.ts` - Adicionar métodos de pagamento

---

### 2. Sistema de QR Code Funcional
**Status:** ⚠️ Parcialmente implementado

**O que falta:**
- Scanner de QR Code para motoristas validarem embarque
- Página de scanner para motoristas (`/scan-qr`)
- Validação em tempo real do QR Code no backend
- Histórico de validações de embarque
- Expiração automática de QR Codes

**Páginas afetadas:**
- `/qr-code` - Gera QR mas não tem validação real
- Falta página `/scan-qr` para motoristas

**Arquivos a criar:**
- `client/src/pages/scan-qr.tsx` - Scanner para motoristas
- `server/routes.ts` - Adicionar rota POST /api/qr/validate

---

### 3. Chat em Tempo Real
**Status:** ❌ Tela estática

**O que falta:**
- Implementar WebSocket (Socket.io)
- Backend para mensagens em tempo real
- Notificações push de novas mensagens
- Histórico de conversas no banco
- Status online/offline dos usuários
- Indicador de mensagem lida/não lida

**Páginas afetadas:**
- `/chat` - Completamente estática

**Arquivos a criar:**
- `server/websocket.ts` - Servidor WebSocket
- `server/routes/messages.ts` - API de mensagens
- `client/src/hooks/useWebSocket.ts` - Hook do Socket.io
- Adicionar tabelas `messages` e `conversations` no schema

---

### 4. Rastreamento em Tempo Real (GPS)
**Status:** ❌ Não implementado

**O que falta:**
- Integração com Geolocation API
- WebSocket para transmitir localização em tempo real
- Mapa com marcadores atualizando ao vivo
- Estimativa de tempo de chegada (ETA)
- Histórico de rotas percorridas

**Páginas afetadas:**
- `/live-tracking` - Usa localização mockada
- `/map` - Não mostra veículos em tempo real

**Arquivos a criar:**
- `server/routes/tracking.ts` - API de rastreamento
- `client/src/hooks/useGeolocation.ts` - Hook GPS
- Adicionar tabela `vehicle_locations` no schema

---

## 🟡 MÉDIA PRIORIDADE

### 5. Sistema de Avaliações e Reputação
**Status:** ❌ Não implementado

**O que falta:**
- Avaliação de motoristas (estrelas + comentários)
- Avaliação de passageiros
- Cálculo de média de avaliações
- Sistema de badges/conquistas
- Bloqueio automático de usuários mal avaliados

**Arquivos a criar:**
- `client/src/pages/rate-ride.tsx` - Tela de avaliação
- `server/routes/ratings.ts` - API de avaliações
- Adicionar tabela `ratings` no schema

---

### 6. Notificações Push
**Status:** ❌ Não implementado

**O que falta:**
- Service Worker para notificações web
- Backend para enviar notificações
- Preferências de notificação do usuário
- Notificações para eventos importantes:
  - Nova solicitação de Bloeia
  - Bloeia confirmada/cancelada
  - Mensagem recebida
  - Assinatura expirando

**Arquivos a criar:**
- `client/public/service-worker.js`
- `server/notifications.ts`
- `client/src/pages/notification-settings.tsx`

---

### 7. Dashboard do Motorista - Ganhos Reais
**Status:** ⚠️ Valores mockados

**O que falta:**
- Calcular ganhos reais baseado em viagens completadas
- Histórico de pagamentos recebidos
- Sistema de saque/transferência
- Relatórios financeiros mensais
- Integração com métodos de recebimento

**Páginas afetadas:**
- `/driver-dashboard` - Mostra valores fictícios

---

### 8. Sistema de Eventos - Funcionalidade Completa
**Status:** ⚠️ Parcialmente implementado

**O que falta:**
- Upload de imagens de eventos funcionando
- Sistema de reserva de transporte para eventos
- Confirmação de reservas pelo admin
- Limite de vagas por evento
- Cancelamento de reservas

**Páginas afetadas:**
- `/events` - Lista eventos mas reservas não funcionam
- `/event-reserve` - Não processa reservas reais

---

### 9. Aprovação de Estudantes
**Status:** ⚠️ Parcialmente implementado

**O que falta:**
- Validação de email universitário
- Upload e validação de documento estudantil
- Sistema de aprovação/rejeição pelo admin
- Email de notificação ao estudante
- Renovação anual de status estudantil

**Páginas afetadas:**
- `/admin-dashboard` - Tem a interface mas falta validação

---

## 🟢 BAIXA PRIORIDADE (Melhorias)

### 10. Sistema de Favoritos
- Salvar rotas favoritas
- Motoristas favoritos
- Locais frequentes

### 11. Histórico e Relatórios
- Relatório de viagens mensais
- Estatísticas de uso
- Exportar dados em PDF/Excel

### 12. Programa de Indicação
- Código de indicação único por usuário
- Bônus para quem indica
- Desconto para novos usuários

### 13. Suporte ao Cliente
- Chat de suporte integrado
- Sistema de tickets
- FAQ dinâmica baseada em busca

### 14. Multi-idioma
- Suporte para Português de Angola
- Suporte para Português do Brasil
- Inglês como idioma adicional

### 15. Dark Mode Completo
- Todos os componentes adaptados
- Persistência de preferência
- Modo automático baseado no horário

### 16. PWA Completo
- Instalável como app nativo
- Funciona offline (cache)
- Sincronização quando voltar online

---

## 📊 CHECKLIST DE FUNCIONALIDADES

### Backend
- [ ] Banco de dados configurado e populado
- [ ] Autenticação JWT funcionando
- [ ] API de pagamentos (Multicaixa)
- [ ] WebSocket para chat
- [ ] WebSocket para rastreamento GPS
- [ ] Sistema de notificações
- [ ] Upload de arquivos (imagens, documentos)
- [ ] Validação de QR Code
- [ ] Cálculo de ganhos de motoristas
- [ ] Sistema de avaliações

### Frontend
- [ ] Todas as páginas consumindo API real
- [ ] Chat em tempo real funcionando
- [ ] Mapa com rastreamento ao vivo
- [ ] Scanner de QR Code
- [ ] Processamento de pagamentos
- [ ] Upload de comprovativos
- [ ] Notificações push
- [ ] Modo offline básico

### Integrações
- [ ] Express Multicaixa API
- [ ] Serviço de email (notificações)
- [ ] Serviço de SMS (opcional)
- [ ] Google Maps API (ou alternativa)
- [ ] Serviço de armazenamento de imagens

---

## 🎯 ROADMAP SUGERIDO

### Fase 1 - Tornar Funcional (2-3 semanas)
1. ✅ Configurar banco de dados
2. Implementar pagamentos via Multicaixa
3. Validação de QR Code
4. Chat em tempo real básico
5. Rastreamento GPS básico

### Fase 2 - Completar Features (2-3 semanas)
1. Sistema de avaliações
2. Notificações push
3. Dashboard motorista com ganhos reais
4. Sistema de eventos completo
5. Aprovação automatizada de estudantes

### Fase 3 - Melhorias (1-2 semanas)
1. PWA completo
2. Modo offline
3. Relatórios e estatísticas
4. Sistema de suporte
5. Programa de indicação

---

## 🔧 CONFIGURAÇÕES NECESSÁRIAS

### Variáveis de Ambiente (.env)
```env
# Banco de dados
DATABASE_URL=postgresql://...

# Multicaixa
MULTICAIXA_API_KEY=
MULTICAIXA_ENTITY_ID=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# JWT
JWT_SECRET=

# Google Maps (ou alternativa)
MAPS_API_KEY=

# Cloudinary (para imagens)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 📞 PRÓXIMOS PASSOS IMEDIATOS

1. **URGENTE:** Configurar banco de dados executando o schema SQL
2. Testar login e cadastro de usuários
3. Implementar integração Multicaixa para pagamentos
4. Implementar WebSocket para chat
5. Implementar rastreamento GPS básico

---

**Última atualização:** 10 de Janeiro de 2025
**Versão do documento:** 1.0
