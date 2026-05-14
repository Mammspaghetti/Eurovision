import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { artists as allArtists } from "@/data/artists";
import NeonButton from "@/components/NeonButton";
import { Trophy, ArrowLeft, Eye } from "lucide-react";

const podiumColors = ["text-gold", "text-silver", "text-bronze"];
const podiumBg = [
  "bg-gold/10 border-gold/30",
  "bg-silver/10 border-silver/30",
  "bg-bronze/10 border-bronze/30",
];

const ResultsPage = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const [showComparison, setShowComparison] = useState(false);
  const [revealed, setRevealed] = useState(0);

  /**
   * 📦 récupération du vote joueur
   */
  const ranking = useMemo(() => {
    return JSON.parse(localStorage.getItem("user_ranking") || "null");
  }, []);

  /**
   * 🎲 résultats stables (UNE seule fois)
   */
  const realResults = useMemo(() => {
    return [...allArtists].sort(() => 0.5 - Math.random());
  }, []);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  /**
   * 🎬 reveal animation
   */
  useEffect(() => {
    if (revealed < realResults.length) {
      const t = setTimeout(() => setRevealed((r) => r + 1), 250);
      return () => clearTimeout(t);
    }
  }, [revealed, realResults.length]);

  /**
   * 🧮 score joueur
   */
  const score = useMemo(() => {
    if (!ranking) return 0;

    return ranking.reduce((acc, artist, userIdx) => {
      const realIdx = realResults.findIndex((a) => a.id === artist.id);

      const diff = Math.abs(realIdx - userIdx);

      const points = Math.max(0, 100 - diff * 5);

      return acc + points;
    }, 0);
  }, [ranking, realResults]);

  const maxScore = allArtists.length * 100;
  const userRank = Math.max(1, Math.ceil((1 - score / maxScore) * 10));

  if (!user) return null;

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto">

      {/* BACK */}
      <button
        onClick={() => navigate("/vote")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {/* TITLE */}
        <h1 className="font-display text-3xl font-bold text-glow mb-6">
          Résultats 🎉
        </h1>

        {/* 👤 PLAYER CARD */}
        {ranking && (
          <div className="mb-6 p-4 rounded-xl border bg-card/60 border-primary/30">
            <p className="text-sm text-muted-foreground">Joueur</p>
            <p className="text-xl font-bold font-display">{user.pseudo}</p>

            <div className="flex justify-between mt-3">
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold text-primary">
                  {score} / {maxScore}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">Rank</p>
                <p className="text-2xl font-bold">#{userRank}</p>
              </div>
            </div>
          </div>
        )}

        {/* PODIUM */}
        <div className="flex items-end justify-center gap-3 mb-8 h-48">
          {[1, 0, 2].map((i) => {
            const artist = realResults[i];
            if (!artist || revealed <= i) return <div key={i} className="flex-1" />;

            const heights = ["h-40", "h-48", "h-32"];

            return (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: i * 0.2 }}
                className={`flex-1 ${heights[i]} rounded-t-xl border flex flex-col items-center justify-end pb-3 ${podiumBg[i]}`}
              >
                <span className="text-3xl">{artist.flag}</span>
                <span className={`font-bold ${podiumColors[i]}`}>#{i + 1}</span>
                <span className="text-xs text-center truncate w-full">
                  {artist.artist}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* LISTE / COMPARAISON TOGGLE */}
        <h2 className="font-display text-xl mb-3">
          {showComparison ? "Comparaison détaillée" : "Classement final"}
        </h2>

        <div className="space-y-2 mb-6">

          <AnimatePresence mode="wait">

            {/* ===================== */}
            {/* MODE 1 : CLASSEMENT FINAL */}
            {/* ===================== */}
            {!showComparison && (
              <motion.div
                key="final"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {realResults.slice(0, revealed).map((artist, i) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/60 border border-border"
                  >
                    <span className="w-6 text-center font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <span>{artist.flag}</span>
                    <span className="flex-1 truncate">{artist.artist}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ===================== */}
            {/* MODE 2 : COMPARAISON */}
            {/* ===================== */}
            {showComparison && ranking && (
              <motion.div
                key="compare"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {ranking.map((artist, userIdx) => {
                  const realIdx = realResults.findIndex((a) => a.id === artist.id);
                  const diff = realIdx - userIdx;
                  const absDiff = Math.abs(diff);

                  const points = Math.max(0, 100 - absDiff * 5);

                  const isExact = diff === 0;
                  const isClose = absDiff <= 2;

                  const color = isExact
                    ? "border-green-400/40 bg-green-500/10 text-green-200"
                    : isClose
                      ? "border-orange-400/40 bg-orange-500/10 text-orange-200"
                      : "border-violet-500/30 bg-violet-500/10 text-violet-200";

                  return (
                    <motion.div
                      key={artist.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`relative flex items-center justify-between px-4 py-3 rounded-lg border ${color}`}
                    >

                      {/* LEFT USER */}
                      <div className="flex items-center gap-2 w-1/3">
                        <span className="font-bold text-sm text-violet-300">
                          #{userIdx + 1}
                        </span>
                        <span>{artist.flag}</span>
                        <span className="truncate text-sm">{artist.artist}</span>
                      </div>

                      {/* CENTER DIFF */}
                      <div className="flex flex-col items-center text-xs font-bold">
                        {isExact ? (
                          <span className="text-green-300">✓ parfait</span>
                        ) : diff > 0 ? (
                          <span className="text-orange-300">🔽 -{absDiff}</span>
                        ) : (
                          <span className="text-violet-300">🔼 +{absDiff}</span>
                        )}
                      </div>

                      {/* RIGHT REAL */}
                      <div className="flex items-center gap-2 w-1/3 justify-end">
                        <span className="text-sm truncate">{artist.artist}</span>
                        <span>{artist.flag}</span>
                        <span className="font-bold text-sm text-muted-foreground">
                          #{realIdx + 1}
                        </span>
                      </div>

                      {/* 💥 SCORE BADGE */}
                      <div className="absolute -right-20 top-1/2 -translate-y-1/2">
                        <div className="
                          px-3 py-1.5
                          text-sm font-bold
                          rounded-lg
                          bg-gradient-to-r from-violet-600/30 to-orange-500/20
                          border border-violet-400/30
                          text-white
                          shadow-[0_0_15px_rgba(168,85,247,0.25)]
                          backdrop-blur-md
                        ">
                          +{points}
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* TOGGLE BUTTON */}
        {ranking && (
          <NeonButton
            onClick={() => setShowComparison((v) => !v)}
            className="w-full mb-4"
          >
            <Eye className="w-4 h-4 mr-2 inline" />
            {showComparison
              ? "Voir le classement final"
              : "Comparer avec mon classement"}
          </NeonButton>
        )}
      </motion.div>
    </div>
  );
};

export default ResultsPage;