import { TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { Container } from "../../components/Container";
import { DefaultButton } from "../../components/DefaultButton";
import { Heading } from "../../components/Heading";
import { MainTemplate } from "../../Templates/MainTemplate";
import styles from "./styles.module.css";

import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { formatDate } from "../../utils/formatDate";
import { getTaskStatus } from "../../utils/getTaskStatus";
import type { TaskModel } from "../../models/TaskModel";

type OrderDirection = "asc" | "desc";

export function History() {
  const { state } = useTaskContext();

  const [orderBy, setOrderBy] = useState<keyof TaskModel>("startDate");
  const [orderDirection, setOrderDirection] = useState<OrderDirection>("desc");

  function getTaskTypeDict(taskType: TaskModel["type"]) {
    const taskTypeDict: Record<TaskModel["type"], string> = {
      workTime: "Foco",
      shortBreakTime: "Descanso curto",
      longFormattersBreakTime: "Descanso longo",
    };

    return taskTypeDict[taskType] ?? "Desconhecido";
  }

  function handleSort(column: keyof TaskModel) {
    if (orderBy === column) {
      setOrderDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setOrderBy(column);
    setOrderDirection("asc");
  }

  function SortIcon({ column }: { column: keyof TaskModel }) {
    if (orderBy !== column) return null;
    return orderDirection === "asc" ? " ▲" : " ▼";
  }

  const sortedTasks = useMemo(() => {
    return [...state.tasks].sort((a: TaskModel, b: TaskModel) => {
      let valueA = a[orderBy];
      let valueB = b[orderBy];

      if (valueA instanceof Date || valueB instanceof Date) {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      if (valueA < valueB) return orderDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return orderDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [state.tasks, orderBy, orderDirection]);

  return (
    <MainTemplate>
      <Container>
        <Heading>
          <span>History</span>

          <span className={styles.buttonContainer}>
            <DefaultButton
              icon={<TrashIcon />}
              color="red"
              aria-label="Apagar todo o histórico"
              title="Apagar histórico"
            />
          </span>
        </Heading>
      </Container>

      <Container>
        <div className={styles.responsiveTable}>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("name")}>
                  Tarefa <SortIcon column="name" />
                </th>

                <th onClick={() => handleSort("duration")}>
                  Duração <SortIcon column="duration" />
                </th>

                <th onClick={() => handleSort("startDate")}>
                  Data <SortIcon column="startDate" />
                </th>

                <th>Status</th>

                <th onClick={() => handleSort("type")}>
                  Tipo <SortIcon column="type" />
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.name}</td>
                  <td>{task.duration}min</td>
                  <td>{formatDate(task.startDate)}</td>
                  <td>{getTaskStatus(task, state.activeTask)}</td>
                  <td>{getTaskTypeDict(task.type)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </MainTemplate>
  );
}
