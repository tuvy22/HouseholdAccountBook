"use client";

import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextProps } from "./UserContext";
import { User } from "../util/types";
import { getLoginUser } from "../util/apiClient";
import { useRouter } from "next/navigation";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const userInfo: User = {
    id: "",
    name: "",
    groupId: -1,
    initialAmount: 0,
  };
  const [user, setUser] = useState<User>(userInfo);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUser(await getLoginUser());
      } catch (error) {
        router.push("/");
      }
    };
    fetchData();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("");
  }
  return context;
};
