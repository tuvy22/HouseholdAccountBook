import { ExpenseForm } from "./ExpenseForm";
import { Suspense } from "react";
import { ExpenseResult } from "./ExpenseResult";

const Expenses = async () => {
  return (
    <main>
      <div className="container mx-auto p-10 max-w-screen-2xl">
        <ExpenseForm />
        <ExpenseResult />
      </div>
    </main>
  );
};

export default Expenses;
