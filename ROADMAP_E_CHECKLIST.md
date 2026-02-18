# 🗺️ ROADMAP VISUAL E CHECKLIST - Chronos Pomodoro

## Phase 1: FUNDAÇÃO (Semanas 1-2) 🏗️

### P1.1 - Setup de Testes
- [ ] Instalar Vitest + Testing Library
- [ ] Criar arquivo de setup (jsdom)
- [ ] Adicionar scripts em package.json
  ```json
  "test": "vitest",
  "test:ui": "vitest --ui",
  "coverage": "vitest --coverage"
  ```
- [ ] Criar testes para utils (formatSecondsToMinutes, getNextCycle, getTaskStatus)
- [ ] Criar testes para taskReducer
- [ ] Criar testes para componentes principais (CountDown, MainForm)
- [ ] Atingir 80% de cobertura

**Entregáveis:**
```
src/
├── __tests__/
├── components/*//__tests__
├── contexts/*//__tests__
└── utils/*//__tests__
vitest.config.ts
.gitignore (add: coverage/)
package.json (atualizado)
```

### P1.2 - Melhorar Tipagem
- [ ] Criar discriminated unions para TaskActionModel
- [ ] Remover todos os `any` types
- [ ] Ativar TypeScript strict mode no tsconfig.json
- [ ] Corrigir erros de tipo
- [ ] Executar `npm run build` com sucesso

**Checklist:**
```typescript
// Antes
const action: any = { type: 'START_TASK', payload: {...} };

// Depois
const action: TaskActionModel = {
  type: TaskActionTypes.START_TASK,
  payload: newTask  // Type-safe!
};
```

### P1.3 - Validação com Zod
- [ ] Instalar Zod
- [ ] Criar src/schemas/taskSchema.ts
- [ ] Criar src/schemas/configSchema.ts
- [ ] Implementar validação em MainForm
- [ ] Implementar validação em Settings
- [ ] Testar validações
- [ ] Atualizar import em TaskModel

**Checklist:**
```bash
npm install zod
```

### P1.4 - Corrigir Bugs Menores
- [ ] Renomear ShowMessage/indexs.tsx → index.tsx
- [ ] Revisar e corrigir imports após renomeação
- [ ] Testar aplicação toda
- [ ] Criar commit: "fix: rename ShowMessage component"

**Commit:**
```bash
git mv src/components/ShowMessage/indexs.tsx src/components/ShowMessage/index.tsx
git add .
git commit -m "fix: rename ShowMessage indexs to index"
```

### P1.5 - CI/CD Pipeline
- [ ] Criar .github/workflows/test.yml
- [ ] Criar .github/workflows/build.yml
- [ ] Adicionar badges ao README
- [ ] Testar pipeline
- [ ] Configurar branch protection rules no GitHub

**test.yml:**
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test -- run
      - run: npm run lint
```

---

## Phase 2: OFFLINE-FIRST (Semana 3) 📱

### P2.1 - Implementar PWA
- [ ] Instalar vite-plugin-pwa
- [ ] Configurar vite.config.ts com PWA plugin
- [ ] Criar manifest.json otimizado
- [ ] Adicionar ícones (192x192, 512x512, maskable)
- [ ] Testar em modo development
- [ ] Testar build e preview
- [ ] Testar instalação em mobile/desktop

**Checklist:**
```bash
npm install -D vite-plugin-pwa
# Adicionar ícones em public/images/favicon/
```

### P2.2 - Service Worker
- [ ] Configurar workbox caching strategies
- [ ] Implementar cache-first para assets estáticos
- [ ] Implementar network-first para dados
- [ ] Testar offline completamente
- [ ] Verificar no DevTools (Application > Service Workers)

**Estratégias:**
```
- HTML/JS/CSS: Cache-First (+ fallback)
- API calls: Network-First
- Images: Cache-First
```

### P2.3 - Testar Offline
- [ ] Desligar internet e verificar funcionamento
- [ ] Testar criar tarefa offline
- [ ] Testar timer offline
- [ ] Testar localStorage offline
- [ ] Desligar Service Worker e testar erro gracioso

---

## Phase 3: FEATURES (Semanas 4-5) 🚀

### P3.1 - Sistema de Projetos/Categorias
- [ ] Criar ProjectModel e adicionar a TaskStateModel
- [ ] Criar novas actions (CREATE_PROJECT, DELETE_PROJECT, etc)
- [ ] Implementar reducer logic para projetos
- [ ] Criar component ProjectManager
- [ ] Adicionar projeto ao criar tarefa
- [ ] Adicionar filtro por projeto em History
- [ ] Adicionar cor customizável por projeto
- [ ] Testar completo

**Models:**
```typescript
type ProjectModel = {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: number;
}
```

**UI Components:**
- ProjectManager (gerenciar projetos)
- ProjectSelector (criar tarefa)
- ProjectFilter (filtrar histórico)

### P3.2 - Página de Estatísticas/Relatórios
- [ ] Criar Page/Stats/index.tsx
- [ ] Calcular total de tarefas (completas, interrompidas)
- [ ] Calcular tempo total de foco
- [ ] Gráfico de produtividade semanal
- [ ] Gráfico de distribuição por projeto
- [ ] Estatísticas por dia da semana
- [ ] Adicionar rota em MainRouter
- [ ] Adicionar link no Menu
- [ ] Adicionar ao histórico breadcrumbs

**Métricas:**
```typescript
interface Stats {
  totalCompleted: number;
  totalInterrupted: number;
  totalFocusMinutes: number;
  averageSessionLength: number;
  completionRate: number;
  bestDay: string;
  bestTime: string;
}
```

### P3.3 - Export de Dados
- [ ] Criar exportService.ts
- [ ] Implementar export JSON
- [ ] Implementar export CSV
- [ ] Criar componentes de UI para download
- [ ] Adicionar botões em Settings e History
- [ ] Testar downloads
- [ ] Adicionar validação de dados antes de export

**Formatos:**
- JSON (backup/restore)
- CSV (Excel/Google Sheets)

### P3.4 - Notificações Desktop
- [ ] Criar notificationService.ts
- [ ] Implementar Notification API check
- [ ] Pedir permissão no primeiro launch
- [ ] Notificar ao completar sesão
- [ ] Notificar ao iniciar break
- [ ] Adicionar custom icons
- [ ] Testar em diferentes navegadores
- [ ] Adicionar configuração para ativar/desativar

**Notificações:**
```
✅ Sessão de foco concluída!
🎉 Hora de descansar!
⏰ Lembrete: já descansou 5 min
```

---

## Phase 4: POLISH (Semana 6) ✨

### P4.1 - Dark Mode baseado no SO
- [ ] Usar prefers-color-scheme media query
- [ ] Respeitar preferência do SO ao iniciar
- [ ] Permitir override manual
- [ ] Testar switching automático
- [ ] Salvar preferência do usuário
- [ ] Atualizar README com instruções

### P4.2 - Atalhos de Teclado
- [ ] Criar hook useKeyboardShortcuts
- [ ] Implementar atalhos principais:
  - `S` - Start/Stop tarefa
  - `I` - Interrupt
  - `R` - Reset
  - `?` - Mostrar ajuda
  - `/` - Focar em search
- [ ] Criar modal de ajuda com lista de atalhos
- [ ] Testar em diferentes navegadores
- [ ] Documentar em README

### P4.3 - Accessibility Improvements
- [ ] Adicionar mais aria-labels
- [ ] Verificar contrast ratio (WCAG AA)
- [ ] Testar com screen reader
- [ ] Adicionar focus indicators
- [ ] Testar navegação por teclado
- [ ] Corrigir warnings do axe DevTools

### P4.4 - Performance Optimization
- [ ] Implementar React.memo em componentes puros
- [ ] Usar useMemo para cálculos pesados
- [ ] Code splitting por rotas (React Router lazy)
- [ ] Tree-shaking de ícones lucide
- [ ] Medir Lighthouse scores
- [ ] Otimizar bundle size

**Lighthouse targets:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

### P4.5 - Documentação
- [ ] Atualizar README.md com features
- [ ] Adicionar screenshots
- [ ] Criar guia de instalação
- [ ] Documentar contribuição
- [ ] Criar CHANGELOG.md
- [ ] Adicionar LICENSE

---

## Phase 5+: FEATURES FUTURAS (Backlog) 🎯

### Baixa Prioridade

#### Recurring Tasks
- [ ] Criar RecurringTask model
- [ ] UI para criar tarefas recorrentes
- [ ] Lógica de geração automática
- [ ] Opção de parar recorrência
- [ ] Relatórios de recorrentes

#### Goals/Metas
- [ ] Criar Goal model
- [ ] UI para criar metas (daily, weekly, monthly)
- [ ] Progresso visual das metas
- [ ] Notificações de meta atingida
- [ ] Histórico de metas

#### Integração com Calendário
- [ ] Google Calendar Sync
- [ ] Exportar para iCal
- [ ] Visualizar em calendario
- [ ] 2-way sync (opcional)

#### Sincronização Entre Dispositivos
- [ ] Usar Firebase ou similar
- [ ] Login/registro (opcional)
- [ ] Sync automático
- [ ] Conflict resolution
- [ ] Modo offline + sync

#### Mobile App
- [ ] React Native / Expo
- [ ] PWA nativa
- [ ] Sincronizar com web
- [ ] Notificações nativas

---

## 📊 Dependências Entre Phases

```
Phase 1 (Testes/Tipagem)
    ↓
Phase 2 (PWA) ← Depende de Phase 1
    ↓
Phase 3 (Features) ← Depende de Phase 1 e 2
    ↓
Phase 4 (Polish) ← Depende de Phases 1, 2, 3
    ↓
Phase 5 (Futuro)
```

---

## 📅 Timeline Estimada

| Phase | Semanas | Milestones |
|-------|---------|-----------|
| 1 | 2 | ✅ Testes, Tipagem, Validação, CI/CD |
| 2 | 1 | ✅ PWA, Offline-first |
| 3 | 2 | ✅ Projetos, Stats, Export, Notificações |
| 4 | 1 | ✅ Polish, Acessibilidade, Performance |
| **TOTAL** | **6** | **Production-ready v1.0** |

---

## 🎯 Success Metrics

Ao completar todas as phases:

```typescript
const metrics = {
  testCoverage: '>= 80%',
  lighthouse: {
    performance: '≥ 90',
    accessibility: '≥ 95',
    bestPractices: '≥ 90',
    seo: '≥ 95',
  },
  bundleSize: {
    js: '< 150kb',
    css: '< 30kb',
  },
  offlineFunctionality: '100%',
  accessibility: 'WCAG 2.1 AA',
  pwa: 'installable',
  browsers: ['Chrome', 'Firefox', 'Safari', 'Edge'],
};
```

---

## 🚀 Como Usar Este Roadmap

### Semana 1-2: Sprint 1
```bash
# Clonar issues para seu GitHub/Jira/Linear
Priority: P1.1, P1.2, P1.3, P1.4
Commits:
- test: add vitest setup
- test: add utils tests
- test: add reducer tests
- refactor: improve type safety
- feat: add zod validation
- fix: rename ShowMessage component
- ci: add github actions workflow
```

### Checklist Diário
- [ ] Código sem `any` types
- [ ] Todos os testes passam
- [ ] Lint sem warnings
- [ ] Build sem erros
- [ ] Commits descritivos

### Checklist por Feature
1. Código escrito
2. Testes escritos
3. Lint e build OK
4. Revisão de código
5. Merge
6. Deploy (se aplicável)

---

## 📝 Comandos Úteis

```bash
# Testes
npm run test
npm run test -- --watch
npm run test -- --coverage

# Build e Preview
npm run build
npm run preview

# Lint
npm run lint
npm run lint -- --fix

# Desenvolvimento
npm run dev

# PWA Testing
npm run build && npm run preview
# Abrir DevTools → Application → Service Workers
```

---

## 🐛 Issue Template para GitHub

```markdown
## 📋 Feature/Bug: [Nome]

### Description
Descrição clara do que fazer.

### Acceptance Criteria
- [ ] Critério 1
- [ ] Critério 2
- [ ] Tests criados
- [ ] Documentação atualizada

### Related Files
- src/components/MyComponent

### Priority
- [ ] P1 (2 dias)
- [ ] P2 (3-5 dias)
- [ ] P3 (5+ dias)

### Labels
- enhancement / bug / testing / documentation
```

---

## 🎓 Recursos de Aprendizado

Se não estiver familiarizado com alguma tecnologia:

- **Vitest:** https://vitest.dev/ (5 minutos)
- **Testing Library:** https://testing-library.com/react (30 minutos)
- **Zod:** https://zod.dev/ (15 minutos)
- **PWA:** https://web.dev/progressive-web-apps/ (1 hora)
- **Service Workers:** https://developers.google.com/web/ilt/pwa (1 hora)
- **React Router v7:** https://reactrouter.com/ (30 minutos)

---

## 📞 Suporte

Dúvidas ou bloqueios? Verificar:
1. Documentação oficial da lib
2. Exemplos em GitHub
3. Stack Overflow
4. Community Discord (React, TypeScript, etc)

---

**Última atualização:** 18 de Fevereiro de 2026  
**Versão:** 1.0  
**Status:** 📋 Pronto para iniciar Phase 1
