import { createContext, useContext, useState } from 'react';
import type {ReactNode} from 'react';

export interface User {
  _id: string;
  username: string;
  email: string;
  iat?: number;
  exp?: number;
}

interface AuthCtx {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const Context = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user,  setUser]  = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem('user') ?? 'null'); }
    catch { return null; }
  });

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token); setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null); setUser(null);
  };

  return <Context.Provider value={{ user, token, login, logout }}>{children}</Context.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
