import { createContext } from "react";
import { AlertValue } from "../components/AlertCustoms";

export interface AlertContextProps {
  alertValues: AlertValue[];
  setAlertValues: React.Dispatch<React.SetStateAction<AlertValue[]>>;
}

export const AlertContext = createContext<AlertContextProps | null>(null);
