// AppContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Artist } from "@/data/artists";

interface User {
  id: number;
  pseudo: string;
  token?: string;
}

interface AppContextType {
  user: User | null;
  login: (pseudo: string, password: string) => Promise<boolean>;
  register: (pseudo: string, email: string, password: string) => Promise<boolean>;
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

  // ======== LOGIN =========
  const login = async (pseudo: string, password: string) => {
    try {
      const res = await fetch("https://eurovision-back.onrender.com/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, password }),
      });

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();
      console.log("✅ Backend login OK:", data);

      setUser({
        id: data.id,
        pseudo: data.pseudo,
        token: data.token,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("pseudo", data.pseudo);

      return true;
    } catch (err) {
      console.warn("⚠️ Backend KO → fallback mock");

      // ===== MOCK LOGIN =====
      if (pseudo === "test" && password === "test") {
        const fakeToken = "mock-token-123";

        setUser({ id:0, pseudo: "test", token: fakeToken });
        localStorage.setItem("token", fakeToken);
        localStorage.setItem("pseudo", "test");

        return true;
      }

      return false;
    }
  };

  // ======== REGISTER =========
  const register = async (pseudo: string, email: string, password: string) => {
    try {
      const res = await fetch("https://eurovision-back.onrender.com/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, email, password }),
      });
      return res.ok;
    } catch (err) {
      console.error("Register failed:", err);
      return false;
    }
  };

  // ======== LOGOUT =========
  const logout = () => {
    setUser(null);
    setRanking(null);
    setHasVoted(false);
    localStorage.removeItem("token");
    localStorage.removeItem("pseudo");
  };

  // ======== PERSISTANCE AU RELOAD =========
  useEffect(() => {
    const token = localStorage.getItem("token");
    const pseudo = localStorage.getItem("pseudo");
    const id = localStorage.getItem("id");

    if (token && pseudo && id) {
      setUser({
        id: Number(id),
        pseudo,
        token,
      });
    }
  }, []);

  // ======== SUBMIT RANKING =========
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