import Reports from "./Reports";

const Page = async () => (
  <>
    <Reports fetchData={await getIncomeAndExpense()} />
  </>
);

export default Page;
