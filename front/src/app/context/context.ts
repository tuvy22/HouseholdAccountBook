import { createContext } from 'react'

export interface UserInfo {
  id: string;
  name: string;
}

export interface UserContextProps {
  user: UserInfo;
  setUser: React.Dispatch<React.SetStateAction<UserInfo>>;
}

export const UserContext = createContext<UserContextProps|null>(null)