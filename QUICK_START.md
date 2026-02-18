# 🚀 QUICK START - Comece a Implementar HOJE

Quer começar? Este documento tem tudo pronto para copiar e colar!

---

## ✅ COMEÇAR AGORA: Primeiros 30 Minutos

### Passo 1: Setup de Testes (5 minutos)

```bash
# Terminal
cd c:\Users\rodri\OneDrive\Documentos\Estudos\chronos-podomoro

# Instalar dependências
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Criareditar vite.config.ts para adicionar ao array plugins:
# (já tem plugins: [react()], só adicionar abaixo)
```

### Passo 2: Criar arquivo vitest.config.ts

Crie novo arquivo: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

### Passo 3: Criar arquivo setup

Crie diretório e arquivo: `src/test/setup.ts`

```typescript
import '@testing-library/jest-dom'
```

### Passo 4: Atualizar package.json

Adicione ao campo "scripts":

```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:watch": "vitest --watch",
  "coverage": "vitest --coverage",
  // ... resto dos scripts existentes
}
```

### Passo 5: Criar primeiro teste

Crie arquivo: `src/utils/__tests__/formatSecondsToMinutes.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { formatSecondsToMinutes } from '../formatSecondsToMinutes'

describe('formatSecondsToMinutes', () => {
  it('deve formatar 0 segundos como 00:00', () => {
    expect(formatSecondsToMinutes(0)).toBe('00:00')
  })

  it('deve formatar 65 segundos como 01:05', () => {
    expect(formatSecondsToMinutes(65)).toBe('01:05')
  })

  it('deve formatar 3661 segundos como 61:01', () => {
    expect(formatSecondsToMinutes(3661)).toBe('61:01')
  })
})
```

### Passo 6: Executar testes

```bash
npm run test

# Deve ver algo como:
# ✓ src/utils/__tests__/formatSecondsToMinutes.test.ts (3 tests)
```

### ✅ Pronto! Primeira fase iniciada!

---

## 🔧 PRÓXIMAS 2 HORAS: Melhorias de Tipagem

### Passo 7: Criar TaskActionModel tipado

Substitua o arquivo: `src/contexts/TaskContext/taskAction.ts`

```typescript
import type { TaskModel } from "../../models/TaskModel";
import type { TaskStateModel } from "../../models/TaskStateModel";

export enum TaskActionTypes {
  START_TASK = "START_TASK",
  COMPLETE_TASK = "COMPLETE_TASK",
  INTERRUPT_TASK = "INTERRUPT_TASK",
  RESET_TASK = "RESET_TASK",
  COUNT_DOWN = "COUNT_DOWN",
  CHANGE_SETTINGS = "CHANGE_SETTINGS",
}

// ✨ Nova: Union type discriminada (Type-safe!)
export type TaskActionModel =
  | {
      type: TaskActionTypes.START_TASK
      payload: TaskModel
    }
  | {
      type: TaskActionTypes.COMPLETE_TASK
    }
  | {
      type: TaskActionTypes.INTERRUPT_TASK
    }
  | {
      type: TaskActionTypes.RESET_TASK
    }
  | {
      type: TaskActionTypes.COUNT_DOWN
      payload: { secondsRemaining: number }
    }
  | {
      type: TaskActionTypes.CHANGE_SETTINGS
      payload: TaskStateModel["config"]
    }
```

### Passo 8: Atualizar taskReducer

Altere a assinatura da função:

```typescript
// De:
export function taskReducer(state: TaskStateModel, action: TaskActionModel) {

// Para:
export function taskReducer(
  state: TaskStateModel,
  action: TaskActionModel
): TaskStateModel {
```

E adicione este ao final do switch:

```typescript
  default: {
    const _exhaustiveCheck: never = action;
    return _exhaustiveCheck;  // TypeError se faltar action type
  }
}
```

### Passo 9: Executar build

```bash
npm run build

# Deve compilar sem erros!
```

---

## 🧮 NAS PRÓXIMAS 3 HORAS: Validação com Zod

### Passo 10: Instalar Zod

```bash
npm install zod
```

### Passo 11: Criar schemas

Crie arquivo: `src/schemas/taskSchema.ts`

```typescript
import { z } from 'zod'

export const TaskTypeSchema = z.enum([
  'workTime',
  'shortBreakTime',
  'longBreakTime',
])

export const TaskModelSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, '❌ Nome não pode estar vazio')
    .max(200, '❌ Nome não pode exceder 200 caracteres'),
  duration: z
    .number()
    .min(1, '❌ Duração mínima é 1 minuto')
    .max(240, '❌ Duração máxima é 240 minutos'),
  startDate: z.number(),
  completeDate: z.number().nullable(),
  interruptDate: z.number().nullable(),
  type: TaskTypeSchema,
})

export const ConfigSchema = z.object({
  workTime: z
    .number()
    .min(1, '❌ Tempo de foco mínimo: 1 min')
    .max(99, '❌ Tempo de foco máximo: 99 min'),
  shortBreakTime: z
    .number()
    .min(1, '❌ Descanso curto mínimo: 1 min')
    .max(30, '❌ Descanso curto máximo: 30 min'),
  longBreakTime: z
    .number()
    .min(1, '❌ Descanso longo mínimo: 1 min')
    .max(60, '❌ Descanso longo máximo: 60 min'),
})

export type TaskModel = z.infer<typeof TaskModelSchema>
export type TaskConfig = z.infer<typeof ConfigSchema>
```

### Passo 12: Usar em MainForm

Abra: `src/components/MainForm/index.tsx`

Adicione import no topo:

```typescript
import { z } from 'zod'
import { TaskModelSchema } from '../../schemas/taskSchema'
```

Substitua a função `handleCreateNewTask`:

```typescript
function handleCreateNewTask(e: React.FormEvent) {
  e.preventDefault()
  showMessage.dismiss()

  if (taskNameInput.current === null) return

  const taskName = taskNameInput.current.value.trim()

  try {
    // Validar nome
    z.string().min(1, 'Nome vazio').parse(taskName)

    const newTask = TaskModelSchema.parse({
      id: Date.now().toString(),
      name: taskName,
      startDate: Date.now(),
      completeDate: null,
      interruptDate: null,
      duration: state.config[nextCycleType],
      type: nextCycleType,
    })

    dispatch({ type: TaskActionTypes.START_TASK, payload: newTask })
    showMessage.sucess('✅ Tarefa criada com sucesso!')
    taskNameInput.current.value = ''
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        showMessage.error(err.message)
      })
    }
  }
}
```

### Passo 13: Usar em Settings

Abra: `src/Pages/Settings/index.tsx`

Adicione imports:

```typescript
import { z } from 'zod'
import { ConfigSchema } from '../../schemas/taskSchema'
```

Substitua `handleSaveSubmit`:

```typescript
function handleSaveSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  showMessage.dismiss()

  try {
    const config = ConfigSchema.parse({
      workTime: Number(workTimeInput.current?.value),
      shortBreakTime: Number(shortBreakTimeInput.current?.value),
      longBreakTime: Number(longBreakTimeInput.current?.value),
    })

    dispatch({
      type: TaskActionTypes.CHANGE_SETTINGS,
      payload: config,
    })

    showMessage.sucess('✅ Configurações salvas!')
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        showMessage.error(`${err.path.join('.')}: ${err.message}`)
      })
    }
  }
}
```

### Passo 14: Testar

```bash
npm run dev

# Ir em Settings e tentar numeros inválidos
# Deve ver mensagens de erro customizadas!
```

---

## 🎯 CHECKPOINT: 5+ HORAS INVESTIDAS

Pronto! Você completou:
- ✅ Vitest setup com testes iniciais
- ✅ Type safety melhorado
- ✅ Validação com Zod em MainForm e Settings
- ✅ Build sem erros
- ✅ Aplicação funcionando melhor

### Próximo passo?

Escolha um (aprox 1-2 horas cada):

1. **PWA (offline-first)** - Instalar vite-plugin-pwa
2. **Notificações Desktop** - Implementar Notification API
3. **Mais testes** - Adicionar testes para History e outros componentes
4. **Export de dados** - JSON/CSV download

---

## 💾 Checklist para Primeira Semana

### Dia 1
- [ ] Setup Vitest
- [ ] Primeiro teste rodando
- [ ] Package.json atualizado

### Dia 2
- [ ] TaskActionModel tipado
- [ ] Testes do reducer
- [ ] Build sem erros

### Dia 3
- [ ] Zod instalado
- [ ] Schemas criados
- [ ] MainForm com validação

### Dia 4
- [ ] Settings com validação
- [ ] Mais testes
- [ ] Coverage > 50%

### Dia 5
- [ ] Review de código
- [ ] Correções
- [ ] Commits limpos
- [ ] PR aberta/merged

### Dia 6-7
- [ ] Iniciar uma feature do roadmap
- [ ] Ou PWA setup
- [ ] Ou mais testes

---

## 🐛 Troubleshooting Rápido

### Erro: "Cannot find module 'vitest'"
```bash
npm install -D vitest
```

### Erro: "jsdom is not installed"
```bash
npm install -D jsdom
```

### Erro: "import.meta.url is not defined"
```bash
# Verificar que está em Ecmascript mode:
# package.json tem "type": "module"
```

### Teste não encontra componente
```bash
# Verificar path do import:
# src/utils/__tests__/file.test.ts
# import { func } from '../funcFile.ts'  // Correto
```

---

## 📊 Progresso Visual

```
Semana 1: [████████████░░░░░░░░░░]  50%
  - Testes: ✅
  - Tipagem: ✅
  - Validação: ✅
  - PWA: ⏳

Semana 2: [████████████████░░░░░░░░░]  60% (continuando)
  - PWA: ⏳
  - Notificações: ⏳
  - Mais Testes: ✅

Semana 3-4: Features principais
Semana 5-6: Polish e production-ready
```

---

## 🎓 Recursos Rápidos

Se tiver dúvida enquanto implementa:

```
Vitest: https://vitest.dev/guide/
Testing Library: https://testing-library.com/docs/react-testing-library/intro
Zod: https://zod.dev/?id=basic-usage
```

---

## 📞 Próximos Passos Recomendados

1. **Agora (hoje):** Seguir este guia até "Checkpoint"
2. **Amanhã:** Adicionar mais testes (cobertura > 60%)
3. **Próxima semana:** Implementar PWA
4. **Semana seguinte:** Começar features (Projetos, Stats)

---

## 🎉 Motivação

> "O melhor código é feito incrementalmente.  
> Pequenas melhorias todos os dias > grandes refatorações raramente."

Cada commit é uma vitória! 🚀

---

**Criado:** 18 de Fevereiro de 2026  
**Tempo estimado para completar:** 5-8 horas  
**Nível de dificuldade:** ⭐⭐ (Intermediário - fácil)

**Boa sorte! 💪**
