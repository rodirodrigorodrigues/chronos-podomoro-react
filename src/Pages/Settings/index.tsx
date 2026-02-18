import { SaveIcon } from "lucide-react";
import { MainTemplate } from "../../Templates/MainTemplate";
import { Container } from "../../components/Container";
import { DefaultButton } from "../../components/DefaultButton";
import { DefaultInput } from "../../components/DefaultInput";
import { Heading } from "../../components/Heading";
import { useRef } from "react";
import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { showMessage } from "../../adapters/showMessage";
import { TaskActionTypes } from "../../contexts/TaskContext/taskAction";

export function Settings() {
  const { state, dispatch } = useTaskContext();

  const workTimeInput = useRef<HTMLInputElement>(null);
  const shortBreakTimeInput = useRef<HTMLInputElement>(null);
  const longBreakTimeInput = useRef<HTMLInputElement>(null);

  function handleSaveSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    showMessage.dismiss();

    const workTime = Number(workTimeInput.current?.value);
    const shortBreakTime = Number(shortBreakTimeInput.current?.value);
    const longBreakTime = Number(longBreakTimeInput.current?.value);

    const formErrors = [];

    if (isNaN(workTime) || isNaN(shortBreakTime) || isNaN(longBreakTime)) {
      formErrors.push("TODOS os campos devem ser números.");
    }

    if (workTime < 0 || workTime > 99) {
      formErrors.push("O tempo de foco deve ser entre 0 e 99 minutos.");
    }

    if (shortBreakTime < 0 || shortBreakTime > 30) {
      formErrors.push(
        "O tempo de descanso curto deve ser entre 0 e 30 minutos.",
      );
    }

    if (longBreakTime < 0 || longBreakTime > 60) {
      formErrors.push(
        "O tempo de descanso longo deve ser entre 0 e 60 minutos.",
      );
    }

    formErrors.forEach((error) => {
      showMessage.error(error);
    });

    dispatch({
      type: TaskActionTypes.CHANGE_SETTINGS,
      payload: {
        workTime,
        shortBreakTime,
        longBreakTime,
      },
    });
  }
  return (
    <>
      <MainTemplate>
        <Container>
          <Heading>Configurações</Heading>
        </Container>
        <Container>
          <p style={{ textAlign: "center" }}>
            Modifique as configurações do aplicativo.
          </p>
        </Container>
        <Container>
          <form action="" className="form" onSubmit={handleSaveSubmit}>
            <div className="formRow">
              <DefaultInput
                id="shortTime"
                labelText="Foco"
                ref={workTimeInput}
                defaultValue={state.config.workTime}
                type="number"
              ></DefaultInput>
            </div>
            <div className="formRow">
              <DefaultInput
                id="shortBreakTime"
                labelText="Descanso curto"
                ref={shortBreakTimeInput}
                defaultValue={state.config.shortBreakTime}
                type="number"
              ></DefaultInput>
            </div>
            <div className="formRow">
              <DefaultInput
                id="longBreakTime"
                labelText="Descanso longo"
                ref={longBreakTimeInput}
                defaultValue={state.config.longBreakTime}
                type="number"
              ></DefaultInput>
            </div>
            <div className="formRow">
              <DefaultButton
                icon={<SaveIcon />}
                aria-label="Salvar configurações"
                title="Salvar configurações"
              ></DefaultButton>
            </div>
          </form>
        </Container>
      </MainTemplate>
    </>
  );
}
