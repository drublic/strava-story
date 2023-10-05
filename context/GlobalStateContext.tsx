// context/GlobalStateContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define your initial state and actions
interface GlobalState {
  // Define your state properties here
  code: string | null;
  activities: any[];
}

// Define action types and action creators
export enum ActionType {
  SET_CODE = "SET_CODE",
  SET_ACTIVITY_DATA = "SET_ACTIVITY_DATA",
  LOGOUT = "LOGOUT",
}

interface SetCodeAction {
  type: ActionType.SET_CODE;
  payload: string | null;
}

interface SetActivityDataAction {
  type: ActionType.SET_ACTIVITY_DATA;
  payload: any[];
}

interface LogoutAction {
  type: ActionType.LOGOUT;
}

type Action = SetCodeAction | SetActivityDataAction | LogoutAction; // Add other action types as needed

// Create a context with initial state and dispatch function
interface GlobalContextType {
  state: GlobalState;
  dispatch: React.Dispatch<Action>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const generateNewState = (state: GlobalState, action: Action) => {
  switch (action.type) {
    case ActionType.SET_CODE:
      return { ...state, code: action.payload };
    case ActionType.SET_ACTIVITY_DATA:
      return { ...state, activities: action.payload };
    case ActionType.LOGOUT:
      return { ...state, activities: [], code: null };
    default:
      return state;
  }
};

// Define a reducer function to handle actions
const globalReducer = (state: GlobalState, action: Action): GlobalState => {
  const newState = generateNewState(state, action);

  try {
    localStorage.setItem("stravaapp", JSON.stringify(newState));
  } catch (e) {
    console.log(e);
  }

  return newState;
};

const initialState = () => {
  try {
    const fromLocalStorage = localStorage.getItem("stravaapp");

    if (!fromLocalStorage) {
      throw new Error("No local storage");
    }

    return JSON.parse(fromLocalStorage);
  } catch (e) {
    return {
      code: null,
      activities: [],
    };
  }
};

// Create a provider component to wrap your app
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(globalReducer, initialState());

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Create a custom hook to access the global state and dispatch function
export const useGlobalState = () => {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }

  return context;
};
