
import "./styles/theme.css";
import "./styles/global.css";
import { Home } from "./Pages/Home";
import { useState } from "react";
import type { TaskStateModel } from "./models/TaskStateModel";

const initialState: TaskStateModel = {
  tasks: [],
  secondsRemaining: 0,
  formattedSecondsRemaining: "01:00",
  activeTask: null,
  currentCycle: 0,
  config: {
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15
  }
}

function App() {
  const [state, setState] = useState(initialState);
  return (
    <>
      <Home state={state} setState={setState} />
    </>
  );
}

export { App };
