import { User } from "@/app/util/types";
import { UserTable } from "./UserTable";

export const UserResult = async () => {
  const fetchData: () => Promise<User[]> = async () => {
    const res = await fetch("http://localhost:8080/api/localhost/user/all", {
      cache: "no-store",
    });
    return res.json();
  };
  const data = await fetchData();
  return <UserTable fetchData={data} />;
};
