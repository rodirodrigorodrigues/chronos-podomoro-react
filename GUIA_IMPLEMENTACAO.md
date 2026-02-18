# 📝 GUIA DE IMPLEMENTAÇÃO - Melhorias do Chronos Pomodoro

## 1. ADICIONAR TESTES UNITÁRIOS COM VITEST

### 1.1 Setup
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 1.2 Configurar vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

### 1.3 Exemplo de Teste - Utils
```typescript
// src/utils/__tests__/formatSecondsToMinutes.test.ts
import { describe, it, expect } from 'vitest';
import { formatSecondsToMinutes } from '../formatSecondsToMinutes';

describe('formatSecondsToMinutes', () => {
  it('deve formatar 0 segundos como 00:00', () => {
    expect(formatSecondsToMinutes(0)).toBe('00:00');
  });

  it('deve formatar 65 segundos como 01:05', () => {
    expect(formatSecondsToMinutes(65)).toBe('01:05');
  });

  it('deve formatar 3661 segundos como 61:01', () => {
    expect(formatSecondsToMinutes(3661)).toBe('61:01');
  });
});
```

### 1.4 Exemplo de Teste - Reducer
```typescript
// src/contexts/TaskContext/__tests__/taskReducer.test.ts
import { describe, it, expect } from 'vitest';
import { taskReducer } from '../taskReducer';
import { TaskActionTypes } from '../taskAction';
import { initialTaskState } from '../initialTaskState';

describe('taskReducer', () => {
  it('START_TASK deve adicionar nova tarefa e incrementar ciclo', () => {
    const action = {
      type: TaskActionTypes.START_TASK,
      payload: {
        id: '1',
        name: 'Test Task',
        duration: 25,
        startDate: Date.now(),
        completeDate: null,
        interruptDate: null,
        type: 'workTime' as const,
      },
    };

    const newState = taskReducer(initialTaskState, action);

    expect(newState.tasks).toHaveLength(1);
    expect(newState.activeTask).toBe(action.payload);
    expect(newState.currentCycle).toBe(1);
  });

  it('COMPLETE_TASK deve marcar tarefa como concluída', () => {
    const taskState = {
      ...initialTaskState,
      tasks: [{
        id: '1',
        name: 'Test',
        duration: 25,
        startDate: Date.now(),
        completeDate: null,
        interruptDate: null,
        type: 'workTime' as const,
      }],
      activeTask: { /* mesmo task */ },
      currentCycle: 1,
      secondsRemaining: 1500,
    };

    const result = taskReducer(taskState, {
      type: TaskActionTypes.COMPLETE_TASK,
    });

    expect(result.activeTask).toBeNull();
    expect(result.tasks[0].completeDate).not.toBeNull();
  });

  it('INTERRUPT_TASK deve marcar tarefa como interrompida', () => {
    // similar ao COMPLETE_TASK
  });

  it('RESET_TASK deve retornar estado inicial', () => {
    const result = taskReducer(
      { /* state válido */ },
      { type: TaskActionTypes.RESET_TASK }
    );

    expect(result).toEqual(initialTaskState);
  });
});
```

### 1.5 Exemplo de Teste - Componente
```typescript
// src/components/CountDown/__tests__/CountDown.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountDown } from '../index';
import { TaskContext } from '../../../contexts/TaskContext/TaskContext';
import { initialTaskState } from '../../../contexts/TaskContext/initialTaskState';

describe('CountDown', () => {
  it('deve renderizar tempo restante formatado', () => {
    const contextValue = {
      state: {
        ...initialTaskState,
        formattedSecondsRemaining: '25:00',
      },
      dispatch: () => {},
    };

    render(
      <TaskContext.Provider value={contextValue}>
        <CountDown />
      </TaskContext.Provider>
    );

    expect(screen.getByText('25:00')).toBeInTheDocument();
  });

  it('deve atualizar quando tempo muda', () => {
    const { rerender } = render(
      <TaskContext.Provider value={{
        state: { ...initialTaskState, formattedSecondsRemaining: '24:59' },
        dispatch: () => {},
      }}>
        <CountDown />
      </TaskContext.Provider>
    );

    expect(screen.getByText('24:59')).toBeInTheDocument();

    rerender(
      <TaskContext.Provider value={{
        state: { ...initialTaskState, formattedSecondsRemaining: '24:58' },
        dispatch: () => {},
      }}>
        <CountDown />
      </TaskContext.Provider>
    );

    expect(screen.getByText('24:58')).toBeInTheDocument();
  });
});
```

---

## 2. ADICIONAR VALIDAÇÃO COM ZOD

### 2.1 Schemas de Validação
```typescript
// src/schemas/taskSchema.ts
import { z } from 'zod';

export const TaskTypeSchema = z.enum(['workTime', 'shortBreakTime', 'longBreakTime']);

export const TaskModelSchema = z.object({
  id: z.string(),
  name: z.string()
    .min(1, 'Nome da tarefa não pode estar vazio')
    .max(200, 'Nome não pode exceder 200 caracteres'),
  duration: z.number()
    .min(1, 'Duração mínima é 1 minuto')
    .max(240, 'Duração máxima é 240 minutos'),
  startDate: z.number(),
  completeDate: z.number().nullable(),
  interruptDate: z.number().nullable(),
  type: TaskTypeSchema,
});

export const ConfigSchema = z.object({
  workTime: z.number()
    .min(1, 'Tempo de foco mínimo é 1 minuto')
    .max(99, 'Tempo de foco máximo é 99 minutos'),
  shortBreakTime: z.number()
    .min(1, 'Descanso curto mínimo é 1 minuto')
    .max(30, 'Descanso curto máximo é 30 minutos'),
  longBreakTime: z.number()
    .min(1, 'Descanso longo mínimo é 1 minuto')
    .max(60, 'Descanso longo máximo é 60 minutos'),
});

export type TaskModel = z.infer<typeof TaskModelSchema>;
export type TaskConfig = z.infer<typeof ConfigSchema>;
```

### 2.2 Usar em MainForm
```typescript
// src/components/MainForm/index.tsx
import { TaskModelSchema } from '../../schemas/taskSchema';
import { showMessage } from '../../adapters/showMessage';

export function MainForm() {
  const { state, dispatch } = useTaskContext();
  const taskNameInput = useRef<HTMLInputElement>(null);

  function handleCreateNewTask(e: React.FormEvent) {
    e.preventDefault();
    showMessage.dismiss();

    if (taskNameInput.current === null) return;

    const taskName = taskNameInput.current.value.trim();

    try {
      // Validar nome
      z.string().min(1).max(200).parse(taskName);

      const newTask = TaskModelSchema.parse({
        id: Date.now().toString(),
        name: taskName,
        startDate: Date.now(),
        completeDate: null,
        interruptDate: null,
        duration: state.config[nextCycleType],
        type: nextCycleType,
      });

      dispatch({ type: TaskActionTypes.START_TASK, payload: newTask });
      showMessage.sucess("Task created successfully.");
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          showMessage.error(err.message);
        });
      }
    }
  }

  // resto do componente...
}
```

### 2.3 Usar em Settings
```typescript
// src/Pages/Settings/index.tsx
import { ConfigSchema } from '../../schemas/taskSchema';

export function Settings() {
  const { state, dispatch } = useTaskContext();
  const workTimeInput = useRef<HTMLInputElement>(null);
  const shortBreakTimeInput = useRef<HTMLInputElement>(null);
  const longBreakTimeInput = useRef<HTMLInputElement>(null);

  function handleSaveSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage.dismiss();

    try {
      const config = ConfigSchema.parse({
        workTime: Number(workTimeInput.current?.value),
        shortBreakTime: Number(shortBreakTimeInput.current?.value),
        longBreakTime: Number(longBreakTimeInput.current?.value),
      });

      dispatch({
        type: TaskActionTypes.CHANGE_SETTINGS,
        payload: config,
      });

      showMessage.sucess('Configurações salvas com sucesso!');
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          showMessage.error(`${err.path.join('.')}: ${err.message}`);
        });
      }
    }
  }

  // resto do componente...
}
```

---

## 3. IMPLEMENTAR PWA

### 3.1 Instalar e Configurar vite-plugin-pwa
```bash
npm install -D vite-plugin-pwa
```

### 3.2 Atualizar vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Chronos Pomodoro',
        short_name: 'Chronos',
        description: 'Aplicação Pomodoro para gerenciar tarefas e aumentar produtividade',
        theme_color: '#0da170',
        background_color: '#0a0f1a',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/images/favicon/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/images/favicon/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/images/favicon/icon-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        categories: ['productivity'],
        screenshots: [
          {
            src: '/screenshots/screenshot1.png',
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'narrow'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2,ttf,eot}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\..*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 horas
              }
            }
          }
        ]
      }
    })
  ]
})
```

### 3.3 Registrar Service Worker (src/main.tsx)
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registrado:', reg))
      .catch(err => console.error('SW erro:', err));
  });
}
```

---

## 4. MELHORAR TIPAGEM DE ACTIONS

### 4.1 Arquivo taskAction.ts Atualizado
```typescript
// src/contexts/TaskContext/taskAction.ts
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

// Union type discriminada - Type-safe!
export type TaskActionModel =
  | {
      type: TaskActionTypes.START_TASK;
      payload: TaskModel;
    }
  | {
      type: TaskActionTypes.COMPLETE_TASK;
    }
  | {
      type: TaskActionTypes.INTERRUPT_TASK;
    }
  | {
      type: TaskActionTypes.RESET_TASK;
    }
  | {
      type: TaskActionTypes.COUNT_DOWN;
      payload: { secondsRemaining: number };
    }
  | {
      type: TaskActionTypes.CHANGE_SETTINGS;
      payload: TaskStateModel["config"];
    };
```

### 4.2 Usar em taskReducer.ts
```typescript
export function taskReducer(
  state: TaskStateModel,
  action: TaskActionModel
): TaskStateModel {
  switch (action.type) {
    case TaskActionTypes.START_TASK: {
      // action.payload agora é garantidamente TaskModel
      const newTask = action.payload;
      // ...resto do código
      return {
        ...state,
        activeTask: newTask,
        tasks: [...state.tasks, newTask],
      };
    }

    case TaskActionTypes.COUNT_DOWN: {
      // action.payload agora é garantidamente { secondsRemaining: number }
      const { secondsRemaining } = action.payload;
      return {
        ...state,
        secondsRemaining,
        formattedSecondsRemaining: formatSecondsToMinutes(secondsRemaining),
      };
    }

    // outros casos...

    default:
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
  }
}
```

---

## 5. ADICIONAR CATEGORIAS (EXEMPLO COMPLETO)

### 5.1 Novos Models
```typescript
// src/models/ProjectModel.ts
export type ProjectModel = {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: number;
};

// src/models/TaskStateModel.ts (atualizado)
import type { ProjectModel } from "./ProjectModel";

export type TaskStateModel = {
  tasks: TaskModel[];
  projects: ProjectModel[];  // NOVO
  secondsRemaining: number;
  formattedSecondsRemaining: string;
  activeTask: TaskModel | null;
  currentCycle: number;
  config: {
    workTime: number;
    shortBreakTime: number;
    longBreakTime: number;
  };
};

// src/models/TaskModel.ts (atualizado)
export type TaskModel = {
  id: string;
  name: string;
  duration: number;
  startDate: number;
  completeDate: number | null;
  interruptDate: number | null;
  type: keyof TaskStateModel["config"];
  projectId?: string;  // NOVO
  tags?: string[];  // NOVO
};
```

### 5.2 Adicionar Ações
```typescript
// src/contexts/TaskContext/taskAction.ts
export enum TaskActionTypes {
  // ... anteriores
  CREATE_PROJECT = "CREATE_PROJECT",
  UPDATE_PROJECT = "UPDATE_PROJECT",
  DELETE_PROJECT = "DELETE_PROJECT",
  ASSIGN_PROJECT = "ASSIGN_PROJECT",
}

export type TaskActionModel =
  | // ... anteriores
  | {
      type: TaskActionTypes.CREATE_PROJECT;
      payload: ProjectModel;
    }
  | {
      type: TaskActionTypes.DELETE_PROJECT;
      payload: { projectId: string };
    }
  | {
      type: TaskActionTypes.ASSIGN_PROJECT;
      payload: { taskId: string; projectId?: string };
    };
```

### 5.3 Implementar Reducer
```typescript
case TaskActionTypes.CREATE_PROJECT: {
  const newProject = action.payload;
  return {
    ...state,
    projects: [...state.projects, newProject],
  };
}

case TaskActionTypes.DELETE_PROJECT: {
  const { projectId } = action.payload;
  return {
    ...state,
    projects: state.projects.filter(p => p.id !== projectId),
    // Remove projectId de todas as tarefas
    tasks: state.tasks.map(t =>
      t.projectId === projectId ? { ...t, projectId: undefined } : t
    ),
  };
}

case TaskActionTypes.ASSIGN_PROJECT: {
  const { taskId, projectId } = action.payload;
  return {
    ...state,
    tasks: state.tasks.map(t =>
      t.id === taskId ? { ...t, projectId } : t
    ),
  };
}
```

### 5.4 Componente para Gerenciar Projetos
```typescript
// src/components/ProjectManager/index.tsx
import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { TaskActionTypes } from "../../contexts/TaskContext/taskAction";
import type { ProjectModel } from "../../models/ProjectModel";
import { TrashIcon, PlusIcon } from "lucide-react";

export function ProjectManager() {
  const { state, dispatch } = useTaskContext();

  function handleCreateProject(name: string) {
    const newProject: ProjectModel = {
      id: Date.now().toString(),
      name,
      color: '#0da170',
      createdAt: Date.now(),
    };

    dispatch({
      type: TaskActionTypes.CREATE_PROJECT,
      payload: newProject,
    });
  }

  function handleDeleteProject(projectId: string) {
    dispatch({
      type: TaskActionTypes.DELETE_PROJECT,
      payload: { projectId },
    });
  }

  return (
    <div>
      <h3>Projetos</h3>
      {state.projects.map(project => (
        <div key={project.id} style={{ display: 'flex', gap: '10px' }}>
          <span style={{ color: project.color }}>●</span>
          <span>{project.name}</span>
          <button onClick={() => handleDeleteProject(project.id)}>
            <TrashIcon size={16} />
          </button>
        </div>
      ))}
      <button onClick={() => handleCreateProject('Novo Projeto')}>
        <PlusIcon size={16} /> Adicionar Projeto
      </button>
    </div>
  );
}
```

---

## 6. NOTIFICAÇÕES DESKTOP

```typescript
// src/services/notificationService.ts
export class NotificationService {
  static requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Browser não suporta Notifications API');
      return;
    }

    if (Notification.permission === 'granted') {
      return;
    }

    if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }

  static notify(title: string, options?: NotificationOptions) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/images/favicon/icon-192.png',
        badge: '/images/favicon/icon-192.png',
        ...options,
      });
    }
  }

  static notifyCompleted() {
    this.notify('Sessão Concluída! ✅', {
      body: 'Parabéns! Você completou uma sessão de foco.',
      tag: 'pomodoro-complete',
    });
  }

  static notifyBreakTime() {
    this.notify('Hora de Descansar 🎉', {
      body: 'Aproveite seu descanso bem merecido.',
      tag: 'pomodoro-break',
    });
  }
}
```

### Usar em TaskContextProvider
```typescript
useEffect(() => {
  NotificationService.requestPermission();
}, []);

worker.onmessage((e: MessageEvent) => {
  const secondsLeft = e.data;
  if (secondsLeft <= 0) {
    if(playBeepRef.current) {
      playBeepRef.current();
    }
    // NOVO: Notificação desktop
    if (state.activeTask?.type === 'workTime') {
      NotificationService.notifyCompleted();
    } else {
      NotificationService.notifyBreakTime();
    }
    dispatch({ type: TaskActionTypes.COMPLETE_TASK });
    worker.terminate();
  }
});
```

---

## 7. EXPORT DE DADOS

```typescript
// src/services/exportService.ts
import type { TaskStateModel } from '../models/TaskStateModel';

export class ExportService {
  static exportJSON(state: TaskStateModel) {
    const dataStr = JSON.stringify(state, null, 2);
    this.downloadFile(dataStr, 'chronos-backup.json', 'application/json');
  }

  static exportCSV(tasks: TaskStateModel['tasks']) {
    const headers = ['ID', 'Nome', 'Duração', 'Tipo', 'Iniciada em', 'Concluída em', 'Interrompida em'];
    const rows = tasks.map(t => [
      t.id,
      t.name,
      t.duration,
      t.type,
      new Date(t.startDate).toLocaleString(),
      t.completeDate ? new Date(t.completeDate).toLocaleString() : '',
      t.interruptDate ? new Date(t.interruptDate).toLocaleString() : '',
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    this.downloadFile(csv, 'chronos-tasks.csv', 'text/csv');
  }

  private static downloadFile(content: string, filename: string, type: string) {
    const element = document.createElement('a');
    element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
```

---

## 8. ATALHOS DE TECLADO

```typescript
// src/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

type ShortcutMap = Record<string, () => void>;

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '?') {
        e.preventDefault();
        // Mostrar lista de atalhos
      }

      const handler = shortcuts[e.key.toLowerCase()];
      if (handler) {
        e.preventDefault();
        handler();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Usar em MainForm
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export function MainForm() {
  const { state, dispatch } = useTaskContext();

  useKeyboardShortcuts({
    's': () => {
      // Start task
      handleCreateNewTask({ preventDefault: () => {} } as any);
    },
    'i': () => {
      // Interrupt task
      if (state.activeTask) {
        handleInterruptTask();
      }
    },
    'r': () => {
      // Reset
      dispatch({ type: TaskActionTypes.RESET_TASK });
    },
  });

  // resto do componente...
}
```

---

## 9. PREFERS-COLOR-SCHEME

```typescript
// Atualizar Menu/index.tsx
export function Menu() {
  const [theme, setTheme] = useState<availableTheme>(() => {
    const stored = localStorage.getItem('theme') as availableTheme;
    if (stored) return stored;

    // Respeitar preferência do SO
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // ...resto do código
}
```

---

## 10. CORRIGIR TYPO EM ShowMessage

```bash
# No terminal:
mv src/components/ShowMessage/indexs.tsx src/components/ShowMessage/index.tsx
```

---

## Próximos Passos

1. ✅ Implementar Zod para validação
2. ✅ Adicionar testes com Vitest
3. ✅ Configurar PWA
4. ✅ Melhorar tipagem
5. ✅ Adicionar notificações desktop
6. ✅ Implementar export
7. ✅ Corrigir typo e refatorações menores

Cada seção pode ser implementada independentemente!
