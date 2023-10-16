import { ListForm } from "./ListForm";
import { ListResult } from "./ListResult";

const List = async () => (
  <div className="container mx-auto p-10 max-w-screen-2xl">
    <ListForm />
    <ListResult />
  </div>
);

export default List;
