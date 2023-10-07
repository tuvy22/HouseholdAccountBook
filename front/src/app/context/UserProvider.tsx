"use client";

import { useContext, useState } from "react";
import { UserContext, UserContextProps, UserInfo } from "./context";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const userInfo: UserInfo = {
    id: "",
    name: "",
  };
  const [user, setUser] = useState<UserInfo>(userInfo);

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
