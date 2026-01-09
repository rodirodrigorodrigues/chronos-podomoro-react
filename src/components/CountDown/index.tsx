import styles from "./styles.module.css";

// { children } destructuring from props
export function CountDown() {
  return (
    <div className={styles.container}>
      00:00
    </div>
  );
}
