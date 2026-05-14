import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { artists as defaultArtists } from "@/data/artists";

import HeaderAdmin from "@/components/admin/HeaderAdmin";
import StatsAdmin from "@/components/admin/StatsAdmin";
import VoteAdmin from "@/components/admin/VoteAdmin";

type VoteStatus = "submitted" | "draft" | "none";

export default function AdminResults() {
  const navigate = useNavigate();

  const [published, setPublished] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, votesRes] = await Promise.all([
          fetch("https://eurovision-back.onrender.com/users/"),
          fetch("https://eurovision-back.onrender.com/votes/")
        ]);

        const usersData = await usersRes.json();
        const votesData = await votesRes.json();

        setUsers(usersData);
        setVotes(votesData);

      } catch (err) {
        console.error("Admin fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================
  // STATUS USERS
  // =========================
  const usersWithStatus = users.map((u) => {
    const vote = votes.find((v) => v.user_id === u.id);

    let status: VoteStatus = "none";

    if (!vote) {
      status = "none";
    } else if (vote.status === "submitted") {
      status = "submitted";
    } else if (vote.status === "draft") {
      status = "draft";
    }

    return {
      ...u,
      voteStatus: status
    };
  });

  // =========================
  // LABEL UI
  // =========================
  const getStatusUI = (status: VoteStatus) => {
    switch (status) {
      case "submitted":
        return {
          label: "✅ Validé (1)",
          color: "text-green-400"
        };

      case "draft":
        return {
          label: "🟡 Brouillon (2)",
          color: "text-yellow-400"
        };

      default:
        return {
          label: "⏳ Pas encore voté (3)",
          color: "text-red-400"
        };
    }
  };

  // =========================
  // PUBLISH
  // =========================
  const publishResults = (items: any) => {
    localStorage.setItem("final_results", JSON.stringify(items));
    localStorage.setItem("results_published", "true");
    setPublished(true);
  };

  const isAfterVote = true;

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

  return (
    <div className="min-h-screen px-4 py-6">

      <div className="flex gap-6 flex-col md:flex-row">

        {/* LEFT */}
        <div className="w-full md:w-1/3 space-y-4">

          <HeaderAdmin published={published} />

          {/* 👉 maintenant tu peux afficher les stats enrichies */}
          <StatsAdmin
            users={usersWithStatus}
            votes={votes}
          />

        </div>

        {/* RIGHT */}
        <div className="w-full md:w-2/3">

          <VoteAdmin
            defaultArtists={defaultArtists}
            isAfterVote={isAfterVote}
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