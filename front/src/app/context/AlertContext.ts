import { Dispatch, SetStateAction, createContext } from "react";
import { AlertValue } from "../components/AlertCustoms";

export interface AlertContextProps {
  alertValues: AlertValue[];
  setAlertValues: Dispatch<SetStateAction<AlertValue[]>>;
}

export const AlertContext = createContext<AlertContextProps | null>(null);
