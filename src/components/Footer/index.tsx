import styles from './styles.module.css'

export function Footer() {
    return <footer className={styles.footer}>
        <a href=''>Entenda como funciona a técnica do pomodoro</a>
        <a href=''>Chronos Podomo &copy; {new Date().getFullYear()}</a>
    </footer>
}