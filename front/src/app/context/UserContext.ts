import { User } from "../util/types";
import { Dispatch, SetStateAction, createContext } from "react";

export interface UserContextProps {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

export const UserContext = createContext<UserContextProps | null>(null);
