import { Container } from "./components/Container";
import { Logo } from "./components/Logo";
import { Menu } from "./components/Menu";
import { CountDown } from "./components/CountDown";

import "./styles/theme.css";
import "./styles/global.css";

function App() {
  return (
    <>
      <Container><Logo /></Container>
      <Container><Menu /></Container>
      <Container><CountDown /></Container>
      <Container>
        <form className="form">
          <div className="formRow">
            <label htmlFor="meuInput">Label</label>
            <input id="meuInput" type="text" />
          </div>
          <div className="formRow">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
          <div className="formRow">
            <p>Ciclos</p>
            <p>0 0 0 0 0 0 0</p>
          </div>
          <div className="formRow">
            <button>Enviar</button>
          </div>
        </form>
      </Container>
    </>
  );
}

export { App };
