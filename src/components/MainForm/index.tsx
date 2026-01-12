import { PlayCircleIcon } from "lucide-react";
import { Cycles } from "../Cycles";
import { DefaultButton } from "../DefaultButton";
import { DefaultInput } from "../DefaultInput";
import { useRef, useState } from "react";
import type { TaskModel } from "../../models/TaskModel";
import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { getNextCycle } from "../../utils/getNextCycle";

export function MainForm() {
  // const [taskName, setTaskName] = useState("");
  const { state, setState } = useTaskContext();

  const taskNameInput = useRef<HTMLInputElement>(null);
  // Já deixa pronto o próximo ciclo entre as renderizações do componente
  const nextCycle = getNextCycle(state.currentCycle);

  console.log("Next cycle:", nextCycle);

  function handleCreateNewTask(e: React.FormEvent) {
    e.preventDefault();
    // console.log(taskName);
    // Input is invalid
    if (taskNameInput.current === null) return;

    const taskName = taskNameInput.current.value.trim();

    if (!taskName) {
      alert("Please enter a valid task name.");
      return;
    }

    const newTask: TaskModel = {
      id: Date.now().toString(),
      name: taskName,
      startDate: Date.now(),
      completeDate: null,
      interruptDate: null,
      duration: 1,
      type: "workTime",
    };

    const secondsRemaining = newTask.duration * 60;

    setState((prevState) => {
      return {
        ...prevState,
        activeTask: newTask,
        currentCycle: nextCycle,
        secondsRemaining,
        formattedSecondsRemaining: "00:00",
        tasks: [...prevState.tasks, newTask],
      };
    });
  }

  return (
    <form className="form" onSubmit={handleCreateNewTask}>
      <div className="formRow">
        <DefaultInput
          labelText="Label"
          id="meuInput"
          type="text"
          placeholder="Digite algo"
          // value={taskName}
          // onChange={(e) => setTaskName(e.target.value)}
          ref={taskNameInput}
        />
      </div>
      <div className="formRow">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>
      <div className="formRow">
        <Cycles />
      </div>
      <div className="formRow">
        <DefaultButton icon={<PlayCircleIcon />} color="green" />
      </div>
    </form>
  );
}
