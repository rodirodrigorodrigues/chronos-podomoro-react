import styles from "./styles.module.css";

type CountDownProps = {
  formattedSecondsRemaining: string;
}

// { children } destructuring from props
export function CountDown({ formattedSecondsRemaining }: CountDownProps) {
  return (
    <div className={styles.container}>
      {formattedSecondsRemaining}
    </div>
  );
}
