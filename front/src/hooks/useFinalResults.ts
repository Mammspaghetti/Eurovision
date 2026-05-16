import { useEffect, useState } from "react";
import { Artist } from "@/data/artists";

export const useFinalResults = () => {
  const [realResults, setRealResults] = useState<Artist[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const [statusRes, leaderboardRes] = await Promise.all([
          fetch("https://eurovision-back.onrender.com/votes/final"),
          fetch("https://eurovision-back.onrender.com/leaderboard/"),
        ]);

        const status = await statusRes.json();
        const leaderboardData = await leaderboardRes.json();

        setPublished(status.published === true);
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);

        // résultats officiels uniquement si backend fournit ranking final
        setRealResults(status.results || []);
      } catch (err) {
        console.error("Error loading final results", err);

        setPublished(false);
        setLeaderboard([]);
        setRealResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const isFinalPublished =
    published === true && leaderboard.length > 0;

  return {
    realResults,
    leaderboard,
    published,
    isFinalPublished,
    loading,
  };
};