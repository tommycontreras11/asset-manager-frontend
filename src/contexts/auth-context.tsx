"use client";

import { useMe } from "@/hooks/api/auth.provider.hook";
import { useSignIn, useSignOut } from "@/mutations/api/auth";
import { IAuth, IMeUser } from "@/providers/http/auth/interface";
import { me } from "@/utils/auth.lib";
import { deleteCookie, saveCookie } from "@/utils/cookie";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  user?: IMeUser | null;
  setUser: Dispatch<SetStateAction<IMeUser | null>>;
  login: (values: IAuth) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider.");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<IMeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { data } = useMe();

  const router = useRouter();

  const { mutate: signOut } = useSignOut(() => {
    deleteCookie().then(() => {
      setIsLoggedIn(false);
      setUser(null);
      window.location.replace("/");
    });
  });

  const { mutate: signIn } = useSignIn(async (data: ISignInResponse) => {
    await saveCookie(data.token);

    const response = await me();
    const user = response.data;

    setUser(user);
    setIsLoggedIn(true);

    router.push("/");
  });

  useEffect(() => {
    const validateUser = async () => {
      if (data) {
        setUser(data);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    validateUser();
  }, [data]);

  const login = (values: IAuth) => {
    signIn(values);
  };

  const logout = () => {
    signOut(undefined);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
