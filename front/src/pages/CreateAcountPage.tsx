import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ConfettiStars from "@/components/ConfettiStars";

export default function Register() {
  const navigate = useNavigate();

  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://eurovision-back.onrender.com/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pseudo, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur inscription");
      }

      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      
      {/* 🌟 Background étoiles */}
      <ConfettiStars />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-glow mb-2">
            ✨ Créer un compte
          </h1>
          <p className="text-muted-foreground">
            Rejoins la soirée Eurovision 🎤
          </p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/70 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-2xl"
        >
          <div className="space-y-5">

            {/* Pseudo */}
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Pseudo
              </label>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => { setPseudo(e.target.value); setError(""); }}
                className="w-full px-4 py-3 rounded-xl bg-input/80 border border-border focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                placeholder="Ton pseudo"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full px-4 py-3 rounded-xl bg-input/80 border border-border focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                placeholder="ton@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full px-4 py-3 rounded-xl bg-input/80 border border-border focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? "Création..." : "🚀 S'inscrire"}
            </button>

          </div>
        </motion.form>

        {/* Login redirect */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Déjà un compte ?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-pink-400 cursor-pointer hover:underline"
          >
            Se connecter
          </span>
        </p>

      </motion.div>
    </div>
  );
}