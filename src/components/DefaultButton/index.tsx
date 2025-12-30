import styles from "./styles.module.css";

// Tem o tipo id e todos os tipos esperados pelo elemento button
// & (intersecção)
type DefaultButtonPros = {
  icon: React.ReactNode;
  color?: 'green' | 'red';
} & React.ComponentProps<'button'>

export function DefaultButton({ icon, color = 'green', ...props }: DefaultButtonPros) {
  return (
    <>
      <button className={`${styles.button} ${styles[color]}`} {...props} >
        {icon}
      </button>
    </>
  );
}
