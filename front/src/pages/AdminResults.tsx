import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { artists as defaultArtists } from "@/data/artists";

import HeaderAdmin from "@/components/admin/HeaderAdmin";
import ResultAdmin from "@/components/admin/ResultAdmin";
import StatsAdmin from "@/components/admin/StatsAdmin";

export default function AdminResults() {
  const navigate = useNavigate();

  const [published, setPublished] = useState(false);
  const [users, setUsers] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📡 fetch backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, votesRes] = await Promise.all([
          fetch("https://eurovision-back.onrender.com/users/"),
          fetch("https://eurovision-back.onrender.com/votes/")
        ]);
        const usersData = await usersRes.json();
        const votesData = await votesRes.json();

        console.log("USERS RAW:", usersData);
        console.log("VOTES RAW:", votesData);

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

  const publishResults = (items) => {
    localStorage.setItem("final_results", JSON.stringify(items));
    localStorage.setItem("results_published", "true");
    setPublished(true);
  };

  const isAfterVote = true; // POC timing (tu brancheras ton HeaderAdmin après)

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

        {/* 🟦 LEFT PANEL */}
        <div className="w-full md:w-1/3 space-y-4">

          {/* HEADER (timer + status vote) */}
          <HeaderAdmin published={published} />

          {/* STATS (users + votes) */}
          <StatsAdmin users={users} votes={votes} />

        </div>

        {/* 🟩 RIGHT PANEL */}
        <div className="w-full md:w-2/3">

          {/* CLASSEMENT FINAL (drag & drop + validation) */}
          <ResultAdmin
            defaultArtists={defaultArtists}
            isAfterVote={isAfterVote}
            onPublish={publishResults}
          />

          {/* ACTION après publish */}
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