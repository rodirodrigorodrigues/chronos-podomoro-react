import { useState } from "react";
import { TaskContext } from "./taskContext";
import { initialTaskState } from "./initialTaskState";

type TextContextProviderProps = {
  children: React.ReactNode;
};

export function TextContextProvider({ children }: TextContextProviderProps) {
  const [state, setState] = useState(initialTaskState);
  return (
    <TaskContext.Provider value={{ state, setState }}>
      {children}
    </TaskContext.Provider>
  );
}
