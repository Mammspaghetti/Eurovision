import { createContext, useContext, useState, ReactNode } from "react";
import { Artist } from "@/data/artists";

interface User {
  pseudo: string;
  token?: string; // <- ajouter token pour l'auth backend
}

interface AppContextType {
  user: User | null;
  login: (pseudo: string, password: string) => Promise<boolean>;
  register: (pseudo: string, password: string) => Promise<boolean>;
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

  // ==============================
  // LOGIN → modifier ici pour appeler ton backend
  // ==============================
  const login = async (pseudo: string, password: string) => {
    // MOCK
    if (pseudo === "test" && password === "test") {
      setUser({ pseudo: "test", token: "fake-token" });
      return true;
    }
    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: pseudo, password }), // correspond à FastAPI
      });

      if (!res.ok) return false;

      const data = await res.json();
      setUser({ pseudo, token: data.access_token }); // on stocke le token
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  // ==============================
  // REGISTER → optionnel si tu veux créer un compte depuis React
  // ==============================
  const register = async (pseudo: string, password: string) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: pseudo, password }),
      });
      return res.ok;
    } catch (err) {
      console.error("Register failed:", err);
      return false;
    }
  };

  // ==============================
  // LOGOUT
  // ==============================
  const logout = () => {
    setUser(null);
    setRanking(null);
    setHasVoted(false);
  };

  // ==============================
  // SUBMIT RANKING
  // ==============================
  const submitRanking = (ranked: Artist[]) => {
    setRanking(ranked);
    setHasVoted(true);
  };

  return (
    <AppContext.Provider
      value={{ user, login, register, logout, ranking, submitRanking, hasVoted }}
    >
      {children}
    </AppContext.Provider>
  );
};