import { Heading } from "./components/Heading";
import "./styles/theme.css";
import "./styles/global.css";
import { TimerIcon } from "lucide-react";

function App() {
  return (
    <>
      <Heading>
        Olá Mundo 1!{" "}
        <button>
          <TimerIcon />
        </button>
      </Heading>
      <Heading>Olá Mundo 2!</Heading>
      <p>O melhor filme de todos os tempos se chama De volta para o futuro</p>
    </>
  );
}

export { App };
