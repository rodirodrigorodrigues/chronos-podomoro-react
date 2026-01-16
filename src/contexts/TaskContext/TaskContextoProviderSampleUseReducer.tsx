// import { useEffect, useReducer, useState } from "react";
// import { TaskContext } from "./taskContext";
// import { initialTaskState } from "./initialTaskState";

// type TextContextProviderProps = {
//   children: React.ReactNode;
// };

// export function TextContextProvider({ children }: TextContextProviderProps) {
//   const [state, setState] = useState(initialTaskState);
//   const [number, dispatch] = useReducer((state, action) => {
//     switch (action) {
//       case 'increment':
//         return state + 1;
//       case 'decrement':
//         return state - 1;
//       default:
//         return state;
//     }
//   }, 0); // Initial state is 0

//   // useEffect(() => {
//   //   console.log("TaskContext state changed:", state);
//   // }, [state]);

//   return (
//     <TaskContext.Provider value={{ state, setState }}>
//       {/* {children} */}
//       <h1>Testando: {number}</h1>
//       <button onClick={() => dispatch('increment')}>INCREMENT +</button>
//       <button onClick={() => dispatch('decrement')}>DECREMENT -</button>
//     </TaskContext.Provider>
//   );
// }


import { useEffect, useReducer, useState } from "react";
import { TaskContext } from "./taskContext";
import { initialTaskState } from "./initialTaskState";

type TextContextProviderProps = {
  children: React.ReactNode;
};

type ActionType = {
  type: string;
  payload?: number; // Normally, payload is a object.
}

export function TextContextProvider({ children }: TextContextProviderProps) {
  const [state, setState] = useState(initialTaskState);
  const [number, dispatch] = useReducer((state, action: ActionType) => {
    switch (action.type) {
      case 'increment': {
        if (!action.payload) return state;
        return state + (action.payload || 1);
      }
      default:
        return state;
    }
  }, 0); // Initial state is 0

  // useEffect(() => {
  //   console.log("TaskContext state changed:", state);
  // }, [state]);

  return (
    <TaskContext.Provider value={{ state, setState }}>
      {/* {children} */}
      <h1>Testando: {number}</h1>
      <button onClick={() => dispatch({ type: 'increment', payload: 10 })}>INCREMENT +10</button>
      <button onClick={() => dispatch({ type: 'increment', payload: 20 })}>DECREMENT +20</button>
    </TaskContext.Provider>
  );
}
