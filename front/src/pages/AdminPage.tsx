import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { artists as defaultArtists } from "@/data/artists";

import HeaderAdmin from "@/components/admin/HeaderAdmin";
import StatsAdmin from "@/components/admin/StatsAdmin";
import VoteAdmin from "@/components/admin/VoteAdmin";
import ResultAdmin from "@/components/admin/ResultAdmin";

type VoteStatus = "submitted" | "draft" | "none";

const VOTE_DURATION = 20 * 60;
const VOTE_START_DATE = new Date("2026-05-16T21:00:00");

export default function AdminPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [published, setPublished] = useState(false);
  const [now, setNow] = useState(new Date());

  // ⏱ timer global
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
  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch(
        "https://eurovision-back.onrender.com/votes/latest"
      );

      const data = await res.json();
      setPublished(data.published);
    };

    fetchStatus();
  }, []);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, votesRes] = await Promise.all([
          fetch("https://eurovision-back.onrender.com/users/"),
          fetch("https://eurovision-back.onrender.com/votes/")
        ]);

        setUsers(await usersRes.json());
        setVotes(await votesRes.json());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const usersWithStatus = users.map((u) => {
    const vote = votes.find((v) => v.user_id === u.id);

    let status: VoteStatus = "none";

    if (vote?.status === "submitted") status = "submitted";
    else if (vote?.status === "draft") status = "draft";

    return { ...u, voteStatus: status };
  });

  // =========================
  // PUBLISH
  // =========================
  const publishResults = (items: any) => {
    localStorage.setItem("final_results", JSON.stringify(items));
    setPublished(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        ⏳ Chargement admin...
      </div>
    );
  }

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
        <div className="w-full md:w-2/3">

          <VoteAdmin
            defaultArtists={defaultArtists}
            isAfterVote={published ? false : isAfterVote}
            onPublish={publishResults}
          />

          {published && (
            <button
              onClick={() => navigate("/results")}
              className="w-full mt-4 py-3 rounded-xl bg-purple-500 text-white font-bold"
            >
              👀 Voir résultats
            </button>
          )}

        </div>

      </div>
    </div>
  );
}