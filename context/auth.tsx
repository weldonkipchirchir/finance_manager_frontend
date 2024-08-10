"use client";
import { createContext, ReactNode, useContext, useState} from "react";

interface User {
  id: number;
  username: string;
  email: string;
}

//create the context
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children} : {children: ReactNode})=>{
    const [user, setUser] = useState<User | null>(null);

     return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};