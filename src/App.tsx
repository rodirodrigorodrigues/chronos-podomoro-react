
import "./styles/theme.css";
import "./styles/global.css";
import { Home } from "./Pages/Home";
import { useState } from "react";
import type { TaskStateModel } from "./models/TaskStateModel";
import { TaskContext } from "./contexts/TaskContext/index";

const initialState: TaskStateModel = {
  tasks: [],
  secondsRemaining: 0,
  formattedSecondsRemaining: "00:00",
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
      <TaskContext.Provider value={{outraCoisa: 'Focus 2005 1.6 8V'}}>
      <Home />
      </TaskContext.Provider>
    </>);
}

export { App };
