"use client";

import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextProps, UserInfo } from "./context";

const UserProvider = ({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) => {
  const userInfo: UserInfo = {
    id: null,
    name: null,
  };
  const [user, setUser] = useState<UserInfo>(userInfo);

  useEffect(() => {
    if (token) {
      fetchDataFromServer();
    }
  }, [token]);

  const fetchDataFromServer = async () => {
    try {
      const response = await fetch("/api/private/user");
      const result: UserInfo = await response.json();
      setUser(result);
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
