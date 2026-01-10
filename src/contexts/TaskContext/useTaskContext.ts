import { useContext } from "react";
import { TaskContext } from "./taskContext";

export function useTaskContext() {
  return useContext(TaskContext);
}