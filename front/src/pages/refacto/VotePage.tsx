import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useApp } from "@/context/AppContext";
import { artists as defaultArtists, Artist } from "@/data/artists";

import VoteRanking from "@/components/votes/VoteRanking";
import VotePanel from "@/components/votes/VotePanel";
import VoteTimer from "@/components/votes/VoteTimer";

import { LogOut } from "lucide-react";

const VOTE_DURATION = 20 * 60;
const VOTE_START_DATE = new Date("2026-05-16T21:00:00");

export default function VotePage() {
  const { user, submitRanking, logout } = useApp();
  const navigate = useNavigate();

  const [now, setNow] = useState(new Date());

  const shuffled = useMemo(
    () => [...defaultArtists].sort(() => Math.random() - 0.5),
    []
  );

  const [items, setItems] = useState<Artist[]>(shuffled);

  const [voteStatus, setVoteStatus] =
    useState<"none" | "draft" | "submitted">("none");

  // TIMER
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const voteStart = VOTE_START_DATE.getTime();
  const voteEnd = voteStart + VOTE_DURATION * 1000;

  const nowMs = now.getTime();

  const isBeforeVote = nowMs < voteStart;
  const isVoteOpen = nowMs >= voteStart && nowMs <= voteEnd;
  const isSubmitted = voteStatus === "submitted";

  const timeLeft = isBeforeVote
    ? Math.floor((voteStart - nowMs) / 1000)
    : Math.floor((voteEnd - nowMs) / 1000);

  // ACTIONS
  const handleSubmit = async () => {
    if (!isVoteOpen) return;

    await fetch("https://eurovision-back.onrender.com/votes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        ranking: items.map((a, i) => ({
          artist_id: a.id,
          position: i + 1,
        })),
      }),
    });

    setVoteStatus("submitted");
    submitRanking(items);
    navigate("/results");
  };

  const saveDraft = async () => {
    await fetch("https://eurovision-back.onrender.com/votes/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        ranking: items.map((a, i) => ({
          artist_id: a.id,
          position: i + 1,
        })),
      }),
    });

    setVoteStatus("draft");
  };

  const simulate = () => {
    localStorage.setItem("user_ranking", JSON.stringify(items));
    navigate("/results");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto relative">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <p>
          Connecté : <span className="font-medium">{user.pseudo}</span>
        </p>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        <h1 className="text-3xl font-bold mb-1">
          Fais ton classement
        </h1>

        {/* TIMER COMPONENT */}
        <VoteTimer
          timeLeft={timeLeft}
          isBeforeVote={isBeforeVote}
        />

        {/* DRAG & DROP RANKING */}
        <VoteRanking
          items={items}
          onChange={setItems}
          disabled={isSubmitted}
        />

        {/* PANEL ACTIONS */}
        <VotePanel
          voteStatus={voteStatus}
          onSubmit={handleSubmit}
          onSaveDraft={saveDraft}
          onSimulate={simulate}
          isVoteOpen={isVoteOpen}
          isSubmitted={isSubmitted}
        />

      </motion.div>
    </div>
  );
}