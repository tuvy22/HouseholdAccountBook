import { EIForm } from "./EIForm";
import { ExpenseResult } from "./ExpenseResult";

const Expenses = async () => (
  <div className="container mx-auto p-10 max-w-screen-2xl">
    <EIForm />
    <ExpenseResult />
  </div>
);

export default Expenses;
