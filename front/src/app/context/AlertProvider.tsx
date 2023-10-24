"use client";

import { useContext, useEffect, useState } from "react";
import { AlertContext, AlertContextProps } from "./AlertContext";
import { AlertValue, Alerts } from "../components/AlertCustoms";

const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertValues, setAlertValues] = useState<AlertValue[]>([]);

  return (
    <AlertContext.Provider value={{ alertValues, setAlertValues }}>
      <Alerts alertValues={alertValues} />
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;

export const useAlert = (): AlertContextProps => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("");
  }
  return context;
};
