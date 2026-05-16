import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useApp } from "@/context/AppContext";
import { artists as allArtists } from "@/data/artists";

import ResultsUserCard from "@/components/results/ResultsUserCard";
import ResultsPodium from "@/components/results/ResultsPodium";
import ResultsRanking from "@/components/results/ResultsRanking";
import ResultsComparison from "@/components/results/ResultsComparison";

import ResultsHeader from "@/components/results/ResultsHeader";
import ResultsToggle from "@/components/results/ResultsToggle";
import { useFinalResults } from "@/hooks/useFinalResults";

const ResultsPage = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const [showComparison, setShowComparison] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const ranking = useMemo(() => {
    return JSON.parse(localStorage.getItem("user_ranking") || "[]");
  }, []);

  const { realResults: apiResults, published, loading } = useFinalResults();

  // =========================
  // FETCH LEADERBOARD
  // =========================
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(
        "https://eurovision-back.onrender.com/leaderboard/"
      );

      const data = await res.json();
      setLeaderboard(data);
    } catch (e) {
      console.error("Leaderboard error", e);
    }
  };

  // =========================
  // LOAD LEADERBOARD SI PUBLIÉ
  // =========================
  useEffect(() => {
    if (published) {
      fetchLeaderboard();
    }
  }, [published]);

  /**
   * 🎲 simulation mock
   */
  const mockResults = useMemo(() => {
    return [...allArtists].sort(() => 0.5 - Math.random());
  }, []);

  /**
   * 🧠 source résultats
   */
  const results = useMemo(() => {
    return published && apiResults?.length
      ? apiResults
      : mockResults;
  }, [published, apiResults, mockResults]);

  const isSimulation = !published;

  /**
   * 🔐 redirect
   */
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  /**
   * popup
   */
  useEffect(() => {
    setShowPopup(true);
    const t = setTimeout(() => setShowPopup(false), 2500);
    return () => clearTimeout(t);
  }, [published]);

  /**
   * reveal animation
   */
  useEffect(() => {
    if (revealed < results.length) {
      const t = setTimeout(() => setRevealed(r => r + 1), 250);
      return () => clearTimeout(t);
    }
  }, [revealed, results.length]);

  if (!user) return null;

  if (loading) {
    return <div className="flex justify-center mt-20">Loading...</div>;
  }

  // =========================
  // USER DATA (REAL LEADERBOARD)
  // =========================
  const userEntry = leaderboard.find((u) => u.user_id === user.id);

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto">

      {/* POPUP */}
      {showPopup && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl shadow-lg text-white
            ${published ? "bg-green-500" : "bg-yellow-500"}`}
        >
          {published
            ? "📢 Résultats officiels publiés !"
            : "🧪 Mode simulation activé"}
        </div>
      )}

      <ResultsHeader onBack={() => navigate("/vote")} />

      {/* SIMULATION BANNER */}
      {isSimulation && (
        <div className="mb-4 p-3 text-center text-sm rounded-lg border border-yellow-400/40 bg-yellow-500/10">
          🧪 Mode simulation — résultats non officiels
        </div>
      )}

      {/* =========================
          🔥 REAL RESULTS MODE
          ========================= */}
      {published && leaderboard.length > 0 ? (
        <>
          {/* USER SCORE / RANK */}
          <div className="mb-4 p-4 rounded-xl border bg-card">
            <p className="text-sm text-muted-foreground">Ton résultat</p>
            <p className="text-xl font-bold">
              #{userEntry?.rank ?? "?"} • {userEntry?.score ?? 0} pts
            </p>
          </div>

          {/* PODIUM + LEADERBOARD */}
          <ResultsPodium realResults={results} revealed={revealed} />

          <div className="space-y-2 mt-4">
            {leaderboard.map((u: any, index: number) => (
              <div
                key={u.user_id}
                className="flex justify-between p-3 rounded-lg border bg-card"
              >
                <div>
                  <p className="font-bold">
                    #{index + 1} {u.pseudo || `User ${u.user_id}`}
                  </p>
                </div>

                <p className="font-bold text-primary">
                  {u.score}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* =========================
              🧪 SIMULATION MODE
              ========================= */}

          <ResultsUserCard
            pseudo={user.pseudo}
            ranking={ranking}
            realResults={results}
          />

          <ResultsPodium realResults={results} revealed={revealed} />

          {showComparison ? (
            <ResultsComparison
              ranking={ranking}
              realResults={results}
            />
          ) : (
            <ResultsRanking realResults={results} />
          )}

          <ResultsToggle
            showComparison={showComparison}
            setShowComparison={setShowComparison}
            disabled={!ranking}
          />
        </>
      )}
    </div>
  );
};

export default ResultsPage;