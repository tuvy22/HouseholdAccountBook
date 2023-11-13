"use client";

import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextProps } from "./UserContext";
import { User } from "../util/types";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const userInfo: User = {
    id: "",
    name: "",
    groupId: -1,
    initialAmount: 0,
  };
  const [user, setUser] = useState<User>(userInfo);

  useEffect(() => {
    fetchDataFromServer().then((data) => {
      if (data) {
        setUser(data);
      }
    });
  }, []);

  const fetchDataFromServer = async () => {
    try {
      const response = await fetch("/api/private/user");
      const result: User = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
