import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { artists as defaultArtists } from "@/data/artists";

import HeaderAdmin from "@/components/admin/HeaderAdmin";
import StatsAdmin from "@/components/admin/StatsAdmin";
import VoteAdmin from "@/components/admin/VoteAdmin";
import ResultAdminPopup from "@/components/admin/ResultAdmin";

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

  const [open, setOpen] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);
  const [popupLeaderboard, setPopupLeaderboard] = useState<any[]>([]);

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

  const formatRank = (n: number) => {
    if (n === 1) return "1er";
    return `${n}e`;
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

    console.log("RAW ranking:", ranking);
    console.log("STRINGIFIED:", JSON.stringify({ ranking }));

    const res = await fetch("https://eurovision-back.onrender.com/votes/submit/final", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ranking }),
    });

    const text = await res.text();
    console.log("RAW RESPONSE:", text);
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

  const openLeaderboardPopup = async () => {
    setOpen(true);
    setPopupLoading(true);

    try {
      const res = await fetch(
        "https://eurovision-back.onrender.com/leaderboard/"
      );

      const data = await res.json();

      setPopupLeaderboard(data);
    } finally {
      setPopupLoading(false);
    }
  };

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

          {/* <div className="space-y-2 mt-4">
            {leaderboard.map((u, index) => {
              const total = leaderboard.length;

              return (
                <div
                  key={u.user_id}
                  className="flex justify-between items-center p-3 rounded-lg border bg-card"
                >
                  <div>
                    <p className="font-bold">
                      {formatRank(index + 1)} User {u.user_id}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      ({index + 1}/{total}) • {u.status}
                    </p>
                  </div>

                  <p className="text-xl font-bold text-primary">
                    {u.score}
                  </p>
                </div>
              );
            })}
          </div> */}

          {published && (
            <button
              onClick={() => navigate("/results")}
              className="w-full mt-4 py-3 rounded-xl bg-blue-500 text-white font-bold"
            >
              👀 Voir résultats
            </button>
          )}
          <button
            onClick={openLeaderboardPopup}
            className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold"
          >
            📊 Voir classement final
          </button>
          {open && (
            <ResultAdminPopup
              leaderboard={popupLeaderboard}
              loading={popupLoading}
              onClose={() => setOpen(false)}
            />
          )}
        </div>

      </div>
    </div>
  );
}