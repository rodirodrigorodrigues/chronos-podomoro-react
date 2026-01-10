import { createContext } from "react";
import type { TaskStateModel } from "../../models/TaskStateModel";
import { initialTaskState } from "./initialTaskState";

const initialTextContextValue = {
  state: initialTaskState,
  setState: () => {},
};

type TaskContextProps = {
  // Os tipos vêm do useState em App.tsx
  state: TaskStateModel;
  setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
};

export const TaskContext = createContext<TaskContextProps>(
  initialTextContextValue
);