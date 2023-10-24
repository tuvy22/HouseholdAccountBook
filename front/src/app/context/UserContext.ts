import { createContext } from "react";
import { User } from "../util/types";

export interface UserContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = createContext<UserContextProps | null>(null);
