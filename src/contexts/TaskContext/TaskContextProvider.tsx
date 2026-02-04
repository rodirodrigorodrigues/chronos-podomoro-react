import { useEffect, useReducer, useRef, useState } from "react";
import { TaskContext } from "./taskContext";
import { initialTaskState } from "./initialTaskState";
import { taskReducer } from "./taskReducer";
import { TimerWorkerSingleton } from "../../workers/timeWorkerSingleton";
import { TaskActionTypes } from "./taskAction";
import { loadBeep } from "../../utils/loadBeep";

type TextContextProviderProps = {
  children: React.ReactNode;
};

export function TextContextProvider({ children }: TextContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState, () => {
    const storageState = localStorage.getItem("state");
    if (storageState === null) { return initialTaskState };
    const parsedStorageState = JSON.parse(storageState);
    return {
      ...parsedStorageState,
      activeTask: null,
      secondsRemaining: 0,
      formattedSecondsRemaining: "00:00"
    };
  });
  const worker = TimerWorkerSingleton.getInstance();
  const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);

  worker.onmessage((e: MessageEvent) => {
    const secondsLeft = e.data;
    if (secondsLeft <= 0) {
      if(playBeepRef.current) {
        playBeepRef.current();
        playBeepRef.current = null;
      }
      dispatch({ type: TaskActionTypes.COMPLETE_TASK });
      worker.terminate();
    } else {
      dispatch({ type: TaskActionTypes.COUNT_DOWN, payload: { secondsRemaining: secondsLeft } });
    }
  });

  useEffect(() => {
    localStorage.setItem("state", JSON.stringify(state));
    if (!state.activeTask) {
      worker.terminate();
    }
    document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`;
    worker.postMessage(state);
    // Precisamos vigiar as variáveis dentro do useEffect mesmo que não mudem
  }, [worker, state]);

  useEffect(() => {
    if (state.activeTask && playBeepRef.current === null) {
      playBeepRef.current = loadBeep();
    } else {
      playBeepRef.current = null;
    }
  }, [state.activeTask])

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
