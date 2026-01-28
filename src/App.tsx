
import "./styles/theme.css";
import "./styles/global.css";
import { Home } from "./Pages/Home";
import { TextContextProvider } from "./contexts/TaskContext/TaskContextProvider";
import { ShowMessage } from "./components/ShowMessage/indexs";

function App() {
  return (
    <>
      <TextContextProvider>
        <ShowMessage>
          <Home />
        </ShowMessage>
      </TextContextProvider>
    </>);
}

export { App };
