"use client";

import { ReactNode, useContext, useEffect, useState } from "react";
import { AlertContext, AlertContextProps } from "./AlertContext";
import { AlertValue, Alerts } from "../components/AlertCustoms";
import {
  LiquidationSearchFormContext,
  LiquidationSearchForm,
  LiquidationSearchFormProps,
} from "./LiquidationSearchFormContext";

export const LiquidationSearchFormProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const defaultLiquidationSearchForm: LiquidationSearchForm = {
    fromDate: "",
    toDate: "",
    userId: "",
  };
  const [liquidationSearchForm, setLiquidationSearchForm] =
    useState<LiquidationSearchForm>(defaultLiquidationSearchForm);

  return (
    <LiquidationSearchFormContext.Provider
      value={{ liquidationSearchForm, setLiquidationSearchForm }}
    >
      {children}
    </LiquidationSearchFormContext.Provider>
  );
};

export const useLiquidationSearchForm = (): LiquidationSearchFormProps => {
  const context = useContext(LiquidationSearchFormContext);

  if (!context) {
    throw new Error("contextError");
  }
  return context;
};
