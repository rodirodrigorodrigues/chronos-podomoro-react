
import "./styles/theme.css";
import "./styles/global.css";
import { Home } from "./Pages/Home";
import { TextContextProvider } from "./contexts/TaskContext/TaskContextProvider";

function App() {
  return (
    <>
      <TextContextProvider>
        <Home />
      </TextContextProvider>
    </>);
}

export { App };
