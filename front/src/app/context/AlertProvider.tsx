"use client";

import { useContext, useEffect, useState } from "react";
import { AlertContext, AlertContextProps } from "./AlertContext";
import { AlertValue, Alerts } from "../components/AlertCustoms";

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertValues, setAlertValues] = useState<AlertValue[]>([]);

  return (
    <AlertContext.Provider value={{ alertValues, setAlertValues }}>
      <Alerts alertValues={alertValues} />
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextProps => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("contextError");
  }
  return context;
};

export const addSuccess = (msg: string, context: AlertContextProps) => {
  const newAlertValue: AlertValue = {
    color: "green",
    value: msg,
  };

  context.setAlertValues([...context.alertValues, newAlertValue]);
};

export const addError = (errMsg: string, context: AlertContextProps) => {
  const newAlertValue: AlertValue = {
    color: "red",
    value: errMsg,
  };

  context.setAlertValues([...context.alertValues, newAlertValue]);
};
