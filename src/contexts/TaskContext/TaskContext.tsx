import { createContext } from "react";
import type { TaskStateModel } from "../../models/TaskStateModel";
import { initialTaskState } from "./initialTaskState";
import type { TaskActionModel } from "./taskAction";

const initialTextContextValue = {
  state: initialTaskState,
  dispatch: () => {}, // or useSate
};

type TaskContextProps = {
  // Os tipos vêm do useState em App.tsx
  state: TaskStateModel;
  dispatch: React.Dispatch<TaskActionModel>;
};

export const TaskContext = createContext<TaskContextProps>(
  initialTextContextValue
);