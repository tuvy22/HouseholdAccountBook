import { Dispatch, SetStateAction, createContext } from "react";

export interface LiquidationSearchForm {
  fromDate: string;
  toDate: string;
  userId: string;
}

export interface LiquidationSearchFormProps {
  liquidationSearchForm: LiquidationSearchForm;
  setLiquidationSearchForm: Dispatch<SetStateAction<LiquidationSearchForm>>;
}

export const LiquidationSearchFormContext =
  createContext<LiquidationSearchFormProps | null>(null);
