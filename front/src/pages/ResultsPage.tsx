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

  // =========================
  // UI STATE
  // =========================
  const [showComparison, setShowComparison] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  // =========================
  // USER RANKING
  // =========================
  const ranking = useMemo(() => {
    return JSON.parse(
      localStorage.getItem("user_ranking") || "[]"
    );
  }, []);

  // =========================
  // FINAL RESULTS HOOK
  // =========================
  const {
    realResults,
    leaderboard,
    published,
    isFinalPublished,
    loading,
  } = useFinalResults();

  // =========================
  // MOCK RESULTS (SIMULATION)
  // =========================
  const mockResults = useMemo(() => {
    return [...allArtists].sort(
      () => 0.5 - Math.random()
    );
  }, []);

  // =========================
  // RESULTS SOURCE
  // =========================
  const results = useMemo(() => {
    return isFinalPublished
      ? realResults
      : mockResults;
  }, [
    isFinalPublished,
    realResults,
    mockResults,
  ]);

  const isSimulation = !isFinalPublished;

  // =========================
  // USER ENTRY
  // =========================
  const userEntry = leaderboard.find(
    (u: any) => u.user_id === user?.id
  );

  // =========================
  // REDIRECT
  // =========================
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // =========================
  // POPUP
  // =========================
  useEffect(() => {
    setShowPopup(true);

    const t = setTimeout(() => {
      setShowPopup(false);
    }, 2500);

    return () => clearTimeout(t);
  }, [published]);

  // =========================
  // REVEAL ANIMATION
  // =========================
  useEffect(() => {
    if (revealed < results.length) {
      const t = setTimeout(() => {
        setRevealed((r) => r + 1);
      }, 250);

      return () => clearTimeout(t);
    }
  }, [revealed, results.length]);

  // =========================
  // GUARDS
  // =========================
  if (!user) return null;

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto">

      {/* =========================
          POPUP
      ========================= */}
      {showPopup && (
        <div
          className={`
            fixed top-4 left-1/2 -translate-x-1/2
            px-4 py-2 rounded-xl shadow-lg text-white z-50
            ${
              isFinalPublished
                ? "bg-green-500"
                : "bg-yellow-500"
            }
          `}
        >
          {isFinalPublished
            ? "📢 Résultats officiels publiés !"
            : "🧪 Mode simulation activé"}
        </div>
      )}

      {/* =========================
          HEADER
      ========================= */}
      <ResultsHeader
        onBack={() => navigate("/vote")}
      />

      {/* =========================
          SIMULATION BANNER
      ========================= */}
      {isSimulation && (
        <div className="mb-4 p-3 text-center text-sm rounded-lg border border-yellow-400/40 bg-yellow-500/10">
          🧪 Mode simulation — résultats non officiels
        </div>
      )}

      {/* =========================
          USER SCORE
      ========================= */}
      {isFinalPublished && (
        <div className="mb-4 p-4 rounded-xl border bg-card">
          <p className="text-sm text-muted-foreground">
            Ton résultat
          </p>

          <p className="text-xl font-bold">
            #{userEntry?.rank ?? "?"}
            {" • "}
            {userEntry?.score ?? 0} pts
          </p>
        </div>
      )}

      {/* =========================
          COMPARISON / RANKING
      ========================= */}
      {showComparison ? (
        <ResultsComparison
          ranking={ranking}
          realResults={results}
        />
      ) : (null)}

      {/* =========================
          TOGGLE
      ========================= */}
      <ResultsToggle
        showComparison={showComparison}
        setShowComparison={setShowComparison}
        disabled={!ranking?.length}
      />

      {/* =========================
          LEADERBOARD
      ========================= */}
      {isFinalPublished && (
        <div className="mt-8">

          <h2 className="text-lg font-bold mb-3">
            🏆 Classement global
          </h2>

          <div className="space-y-2">

            {leaderboard.map(
              (u: any, index: number) => (
                <div
                  key={u.user_id}
                  className="flex justify-between p-3 rounded-lg border bg-card"
                >
                  <div>
                    <p className="font-bold">
                      #{index + 1}
                      {" "}
                      {u.pseudo || `User ${u.user_id}`}
                    </p>
                  </div>

                  <p className="font-bold text-primary">
                    {u.score} pts
                  </p>
                </div>
              )
            )}

          </div>
        </div>
      )}

      {/* =========================
          USER CARD ONLY IN SIMULATION
      ========================= */}
      {isSimulation && (
        <div className="mt-8">
          <ResultsUserCard
            pseudo={user.pseudo}
            ranking={ranking}
            realResults={results}
          />
        </div>
      )}
    </div>
  );
};

export default ResultsPage;