import { createContext, useContext, useState, ReactNode } from "react";
import { Artist } from "@/data/artists";

interface User {
  pseudo: string;
}

interface AppContextType {
  user: User | null;
  login: (pseudo: string, password: string) => boolean;
  logout: () => void;
  ranking: Artist[] | null;
  submitRanking: (ranked: Artist[]) => void;
  hasVoted: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be within AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [ranking, setRanking] = useState<Artist[] | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const login = (pseudo: string, _password: string) => {
    if (pseudo.trim().length > 0) {
      setUser({ pseudo: pseudo.trim() });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRanking(null);
    setHasVoted(false);
  };

  const submitRanking = (ranked: Artist[]) => {
    setRanking(ranked);
    setHasVoted(true);
  };

  return (
    <AppContext.Provider value={{ user, login, logout, ranking, submitRanking, hasVoted }}>
      {children}
    </AppContext.Provider>
  );
};
