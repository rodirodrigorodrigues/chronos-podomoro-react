import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import styles from "./styles.module.css";

// { children } destructuring from props
export function CountDown() {
  const { state } = useTaskContext()
  return (
    <div className={styles.container}>
      {state.formattedSecondsRemaining}
    </div>
  );
}
