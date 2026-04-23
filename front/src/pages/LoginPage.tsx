import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import NeonButton from "@/components/NeonButton";
import GoodiesCarousel from "@/components/GoodiesCarousel";
import ConfettiStars from "@/components/ConfettiStars";
import { Gift, Music, Trophy } from "lucide-react";

const LoginPage = () => {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim()) return setError("Entre ton pseudo !");
    if (!password) return setError("Entre un mot de passe !");
    const ok = await login(pseudo, password);
    if (ok) navigate("/vote");
    else setError("Erreur de connexion");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      <ConfettiStars />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-4"
          >
            <Music className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
               Eurovision 2026 — Wien 🇦🇹
            </span>
          </motion.div>
          <h1 className="font-display text-5xl font-bold text-glow mb-3">
            Soirée Eurovision 🎤
          </h1>
          <p className="text-muted-foreground text-lg">
            Fais tes pronostics et gagne des goodies !
          </p>
        </div>
        {/* Kermit présentateur */}
        <motion.img
          src="/kermit.png" // mets ton image dans /public
          alt="Kermit presenter"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-32 mx-auto mb-4 drop-shadow-xl"
        />
        {/* Login form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 mb-4"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Pseudo</label>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => { setPseudo(e.target.value); setError(""); }}
                className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Ton pseudo"
                maxLength={30}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Mot de passe"
                maxLength={50}
              />
            </div>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-accent text-sm">
                {error}
              </motion.p>
            )}
            <NeonButton type="submit" className="w-full">Se connecter</NeonButton>
          </div>
        </motion.form>

        {/* Créer un compte */}
        <div className="flex justify-center mb-6">
          <button
            className="text-sm text-primary underline hover:text-neon-yellow transition-colors"
            onClick={() => navigate("/register")}
          >
            Créer un compte
          </button>
        </div>

        {/* Goodies section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/40 backdrop-blur-sm border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-neon-yellow" />
            <h2 className="font-display text-xl font-semibold">Goodies à gagner</h2>
          </div>

          <GoodiesCarousel />

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
            <Trophy className="w-4 h-4 text-gold" />
            <span>Classe-toi en haut du classement pour gagner !</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;