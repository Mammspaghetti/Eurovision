import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { artists as defaultArtists } from "@/data/artists";

import HeaderAdmin from "@/components/admin/HeaderAdmin";
import StatsAdmin from "@/components/admin/StatsAdmin";
import VoteAdmin from "@/components/admin/VoteAdmin";

type VoteStatus = "submitted" | "draft" | "none";

const VOTE_DURATION = 20 * 60;
const VOTE_START_DATE = new Date("2026-05-16T21:00:00");

export default function AdminPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingRecalc, setLoadingRecalc] = useState(false);

  const [published, setPublished] = useState(false);
  const [now, setNow] = useState(new Date());

  // =========================
  // TIMER
  // =========================
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const voteEnd =
    VOTE_START_DATE.getTime() + VOTE_DURATION * 1000;

  const isAfterVote = now.getTime() > voteEnd;

  // =========================
  // FETCH STATUS
  // =========================
  const fetchStatus = async () => {
    const res = await fetch(
      "https://eurovision-back.onrender.com/votes/latest"
    );

    const data = await res.json();
    setPublished(data.published);
  };

  // =========================
  // FETCH USERS + VOTES
  // =========================
  const fetchUsersAndVotes = async () => {
    const [usersRes, votesRes] = await Promise.all([
      fetch("https://eurovision-back.onrender.com/users/"),
      fetch("https://eurovision-back.onrender.com/votes/"),
    ]);

    const usersData = await usersRes.json();
    const votesData = await votesRes.json();

    setUsers(usersData);
    setVotes(votesData);
  };

  // =========================
  // FETCH LEADERBOARD
  // =========================
  const fetchLeaderboard = async () => {
    const res = await fetch(
      "https://eurovision-back.onrender.com/leaderboard/"
    );

    const data = await res.json();
    setLeaderboard(data);
  };

  // =========================
  // INIT LOAD
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([
          fetchUsersAndVotes(),
          fetchLeaderboard(),
          fetchStatus(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // =========================
  // SUBMIT VOTE
  // =========================
  const submitVote = async (ranking: any[]) => {
    try {
      const res = await fetch(
        "https://eurovision-back.onrender.com/votes/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: 1,
            ranking,
          }),
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      console.log("📊 RESULT:", data);

      // refresh propre
      await fetchUsersAndVotes();
      await fetchLeaderboard();

      alert("✅ Vote envoyé");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur envoi vote");
    }
  };

  // =========================
  // RECALC LEADERBOARD
  // =========================
  const recalcLeaderboard = async () => {
    try {
      setLoadingRecalc(true);

      const res = await fetch(
        "https://eurovision-back.onrender.com/leaderboard/recalculate",
        {
          method: "POST",
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      setLeaderboard(data.leaderboard);

    } catch (e) {
      console.error(e);
      alert("Erreur calcul leaderboard");
    } finally {
      setLoadingRecalc(false);
    }
  };

  // =========================
  // USERS STATUS
  // =========================
  const usersWithStatus = users.map((u) => {
    const vote = votes.find((v) => v.user_id === u.id);

    let status: VoteStatus = "none";

    if (vote?.status === "submitted") status = "submitted";
    else if (vote?.status === "draft") status = "draft";

    return { ...u, voteStatus: status };
  });

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        ⏳ Chargement admin...
      </div>
    );
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div className="min-h-screen px-4 py-6">

      <div className="flex gap-6 flex-col md:flex-row">

        {/* LEFT */}
        <div className="w-full md:w-1/3 space-y-4">

          <HeaderAdmin
            published={published}
            isAfterVote={isAfterVote}
            voteEnd={voteEnd}
            now={now}
          />

          <StatsAdmin
            users={usersWithStatus}
            votes={votes}
          />

        </div>

        {/* RIGHT */}
        <div className="w-full md:w-2/3 space-y-4">

          <VoteAdmin
            defaultArtists={defaultArtists}
            onSubmit={submitVote}
          />

          <button
            onClick={recalcLeaderboard}
            disabled={loadingRecalc}
            className="w-full py-3 rounded-xl bg-purple-500 text-white font-bold"
          >
            {loadingRecalc ? "⏳ Calcul..." : "🧮 Calculer les scores"}
          </button>

          <button
            onClick={fetchLeaderboard}
            className="w-full py-3 rounded-xl bg-green-500 text-white font-bold"
          >
            🔄 Afficher classement
          </button>

          <div className="space-y-2 mt-4">
            {leaderboard.map((u) => (
              <div
                key={u.user_id}
                className="flex justify-between items-center p-3 rounded-lg border bg-card"
              >
                <div>
                  <p className="font-bold">User {u.user_id}</p>
                  <p className="text-xs text-muted-foreground">
                    #{u.rank} • {u.status}
                  </p>
                </div>

                <p className="text-xl font-bold text-primary">
                  {u.score}
                </p>
              </div>
            ))}
          </div>

          {published && (
            <button
              onClick={() => navigate("/results")}
              className="w-full mt-4 py-3 rounded-xl bg-blue-500 text-white font-bold"
            >
              👀 Voir résultats
            </button>
          )}

        </div>

      </div>
    </div>
  );
}