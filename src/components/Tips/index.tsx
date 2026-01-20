import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { getNextCycle } from "../../utils/getNextCycle";
import { getNextCycleType } from "../../utils/getNextCycleType";

export function Tips() {
  const { state } = useTaskContext();
  const nextCycle = getNextCycle(state.currentCycle);
  const nextCycleType = getNextCycleType(nextCycle);
  const tipsForWhenActiveTask = {
    workTime: <span>Foque por {state.config.workTime} minutos.</span>,
    shortBreakTime: (
      <span>Descanse por {state.config.shortBreakTime} minutos.</span>
    ),
    longBreakTime: (
      <span>Descanse por {state.config.longBreakTime} minutos.</span>
    ),
  };

  const tipsForWhenNotActiveTask = {
    workTime: <span>Próximo ciclo é de {state.config.workTime} minutos.</span>,
    shortBreakTime: (
      <span>Próximo descanso é de {state.config.shortBreakTime} minutos.</span>
    ),
    longBreakTime: (
      <span>Próximo descanso é de {state.config.longBreakTime} minutos.</span>
    ),
  };
  return (
    <>
      <p>
        {state.activeTask && tipsForWhenActiveTask[state.activeTask.type]}
        {!state.activeTask && tipsForWhenNotActiveTask[nextCycleType]}
      </p>
    </>
  );
}
