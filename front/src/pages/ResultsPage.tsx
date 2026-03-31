import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { artists as allArtists } from "@/data/artists";
import NeonButton from "@/components/NeonButton";
import { Trophy, Medal, ArrowLeft, Eye } from "lucide-react";

// Simulated "real" results
const realResults = [...allArtists].sort(() => 0.5 - Math.random());

const podiumColors = ["text-gold", "text-silver", "text-bronze"];
const podiumBg = ["bg-gold/10 border-gold/30", "bg-silver/10 border-silver/30", "bg-bronze/10 border-bronze/30"];

const ResultsPage = () => {
  const { user, ranking } = useApp();
  const navigate = useNavigate();
  const [showComparison, setShowComparison] = useState(false);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // Reveal results one by one with suspense
  useEffect(() => {
    if (revealed < realResults.length) {
      const timeout = setTimeout(() => setRevealed((r) => r + 1), 300);
      return () => clearTimeout(timeout);
    }
  }, [revealed]);

  // Calculate user's score
  const calculateScore = () => {
    if (!ranking) return 0;
    let score = 0;
    ranking.forEach((artist, userIdx) => {
      const realIdx = realResults.findIndex((a) => a.id === artist.id);
      const diff = Math.abs(userIdx - realIdx);
      score += Math.max(0, allArtists.length - diff);
    });
    return score;
  };

  const maxScore = allArtists.length * allArtists.length;
  const score = calculateScore();
  const userRank = Math.max(1, Math.ceil((1 - score / maxScore) * 10));

  if (!user) return null;

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto">
      <button
        onClick={() => navigate("/vote")}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Retour</span>
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-glow mb-6">Résultats 🎉</h1>

        {/* Podium */}
        <div className="flex items-end justify-center gap-3 mb-8 h-48">
          {[1, 0, 2].map((podiumIdx) => {
            const artist = realResults[podiumIdx];
            if (!artist || revealed <= podiumIdx) return <div key={podiumIdx} className="flex-1" />;
            const heights = ["h-40", "h-48", "h-32"];
            return (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: podiumIdx * 0.3, type: "spring", bounce: 0.4 }}
                className={`flex-1 ${heights[podiumIdx]} rounded-t-xl border flex flex-col items-center justify-end pb-3 ${podiumBg[podiumIdx]}`}
              >
                <span className="text-3xl mb-1">{artist.flag}</span>
                <span className={`font-display font-bold text-lg ${podiumColors[podiumIdx]}`}>
                  #{podiumIdx + 1}
                </span>
                <span className="text-xs text-center font-medium px-1 truncate w-full">{artist.artist}</span>
                <span className="text-xs text-muted-foreground">{artist.country}</span>
              </motion.div>
            );
          })}
        </div>

        {/* User score */}
        {ranking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="bg-card/60 border border-primary/30 rounded-xl p-5 mb-6 box-glow"
          >
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-6 h-6 text-primary" />
              <h2 className="font-display text-xl font-bold">Ton résultat</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-display font-bold gradient-neon-text">{score}</p>
                <p className="text-sm text-muted-foreground">points</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display font-bold gradient-neon-text">#{userRank}</p>
                <p className="text-sm text-muted-foreground">classement</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Full ranking */}
        <h2 className="font-display text-xl font-semibold mb-3">Classement final</h2>
        <div className="space-y-2 mb-6">
          <AnimatePresence>
            {realResults.slice(0, revealed).map((artist, i) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-card/60 border border-border"
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold font-display ${
                  i < 3 ? `${podiumBg[i]} ${podiumColors[i]}` : "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                <span className="text-xl">{artist.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{artist.artist}</p>
                  <p className="text-xs text-muted-foreground">{artist.country}</p>
                </div>
                <span className="text-sm font-display text-muted-foreground">
                  {Math.max(0, (allArtists.length - i) * 10)} pts
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Comparison toggle */}
        {ranking && (
          <>
            <NeonButton
              variant="pink"
              onClick={() => setShowComparison(!showComparison)}
              className="w-full mb-4"
            >
              <Eye className="w-4 h-4 inline mr-2" />
              {showComparison ? "Masquer" : "Voir"} mon classement vs résultats
            </NeonButton>

            <AnimatePresence>
              {showComparison && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  {ranking.map((artist, i) => {
                    const realIdx = realResults.findIndex((a) => a.id === artist.id);
                    const diff = realIdx - i;
                    return (
                      <div
                        key={artist.id}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <span className="w-6 text-sm font-display font-bold text-muted-foreground">
                          #{i + 1}
                        </span>
                        <span>{artist.flag}</span>
                        <span className="flex-1 text-sm font-medium truncate">{artist.artist}</span>
                        <span className={`text-xs font-bold ${
                          diff === 0 ? "text-primary" : diff > 0 ? "text-accent" : "text-secondary"
                        }`}>
                          {diff === 0 ? "✓" : diff > 0 ? `↑${diff}` : `↓${Math.abs(diff)}`}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResultsPage;
