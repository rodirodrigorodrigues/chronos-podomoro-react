import "./styles/theme.css";
import "./styles/global.css";
import { TextContextProvider } from "./contexts/TaskContext/TaskContextProvider";
import { ShowMessage } from "./components/ShowMessage/indexs";
import { MainRouter } from "./routers/MainRouter";

function App() {
  return (
    <>
      <TextContextProvider>
        <ShowMessage>
          <MainRouter />
        </ShowMessage>
      </TextContextProvider>
    </>
  );
}

export { App };
