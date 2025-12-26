import styles from "./styles.module.css";

// Tem o tipo id e todos os tipos esperados pelo elemento input
// & (intersecção)
type DefaultInputPros = {
  id: string;
  labelText: string;
} & React.ComponentProps<'input'>

export function DefaultInput({ id, type, labelText, ...rest }: DefaultInputPros) {
  return (
    <>
      <label htmlFor="meuInput">{labelText}</label>
      <input className={styles.input} id={id} type={type} {...rest} />
    </>
  );
}
