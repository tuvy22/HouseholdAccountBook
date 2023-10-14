import { ExpenseForm } from "./ExpenseForm";
import { IncomeForm } from "./IncomeForm";
import { EITabs } from "./EITabs";

export const EIForm = () => {
  return (
    <EITabs>
      <IncomeForm />
      <ExpenseForm />
    </EITabs>
  );
};
