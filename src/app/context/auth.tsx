"use client";

import { type UUID } from "crypto";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type Auth =
  | {
      isLoggedIn: false;
    }
  | {
      isLoggedIn: true;
      userId: UUID;
      username: string;
      email: string;
    };

export type AuthContextType = {
  auth: Auth;
  setAuthState: Dispatch<SetStateAction<Auth>>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Context not found");
  }
  return context;
};

export default function Auth({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<Auth>({ isLoggedIn: false });

  return (
    <AuthContext.Provider value={{ auth: authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}
