import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useApp } from "@/context/AppContext";
import { artists as defaultArtists, Artist } from "@/data/artists";

import SortableArtist from "@/components/SortableArtist";
import NeonButton from "@/components/NeonButton";
import { Clock, CheckCircle, LogOut } from "lucide-react";

const VOTE_DURATION = 20 * 60;
const VOTE_START_DATE = new Date("2026-05-16T21:00:00");

const VotePage = () => {
  const { user, submitRanking, hasVoted, logout } = useApp();
  const navigate = useNavigate();

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const voteStart = VOTE_START_DATE.getTime();
  const voteEnd = voteStart + VOTE_DURATION * 1000;
  const nowMs = now.getTime();

  const isBeforeVote = nowMs < voteStart;
  const isVoteOpen = nowMs >= voteStart && nowMs <= voteEnd;

  const timeLeft = isBeforeVote
    ? Math.floor((voteStart - nowMs) / 1000)
    : Math.floor((voteEnd - nowMs) / 1000);

  const shuffled = useMemo(
    () => [...defaultArtists].sort(() => Math.random() - 0.5),
    []
  );

  const [items, setItems] = useState<Artist[]>(shuffled);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSubmit = async () => {
    if (!isVoteOpen) return;

    await fetch("https://ton-backend.onrender.com/votes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        ranking: items,
      }),
    });

    submitRanking(items);
    navigate("/results");
  };

  const simulateResults = () => {
    const fake = [...defaultArtists].sort(() => Math.random() - 0.5);

    localStorage.setItem("fake_results", JSON.stringify(fake));
    localStorage.setItem("simulation_mode", "true");
    localStorage.setItem("user_ranking", JSON.stringify(items));

    navigate("/results");
  };

  if (!user) return null;

  if (hasVoted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-glow mb-2">
            Vote enregistré !
          </h2>
          <p className="text-muted-foreground mb-6">
            Résultats bientôt disponibles 🎉
          </p>

          <NeonButton onClick={() => navigate("/results")}>
            Voir les résultats
          </NeonButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Connecté :{" "}
          <span className="text-foreground font-medium">
            {user.pseudo}
          </span>
        </p>

        <button onClick={() => { logout(); navigate("/"); }}>
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        <h1 className="font-display text-3xl font-bold text-glow mb-1">
          Fais ton classement
        </h1>

        <p className="text-muted-foreground mb-4">
          Classe les artistes du meilleur au pire
        </p>

        {/* TIMER */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border mb-6">
          <Clock
            className={`w-4 h-4 ${
              isBeforeVote ? "text-gray-400" : "text-primary"
            }`}
          />

          <span className="font-display font-bold">
            {isBeforeVote
              ? `Début dans : ${formatTime(timeLeft)}`
              : `Fin dans : ${formatTime(timeLeft)}`}
          </span>
        </div>

        {/* LISTE */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((a) => a.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 mb-6">
              {items.map((artist, index) => (
                <SortableArtist
                  key={artist.id}
                  artist={artist}
                  index={index}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* BOUTONS (améliorés) */}
        <div className="space-y-3">

          <NeonButton
            onClick={handleSubmit}
            disabled={!isVoteOpen}
            className="w-full py-3 text-lg font-semibold"
          >
            🚀 Valider mon classement
          </NeonButton>

          <NeonButton
            onClick={() =>
              localStorage.setItem("vote_draft", JSON.stringify(items))
            }
            className="w-full py-3 border border-pink-500/40 text-pink-400 bg-transparent hover:bg-pink-500 hover:text-white transition-all"
          >
            💾 Sauvegarder brouillon
          </NeonButton>

          <NeonButton
            onClick={simulateResults}
            className="w-full py-3 border border-purple-500/40 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white transition-all"
          >
            🎲 Simuler les résultats
          </NeonButton>

        </div>

      </motion.div>
    </div>
  );
};

export default VotePage;

/* helper */
const formatTime = (s) => {
  const days = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  if (days > 0) {
    return `${days}j ${h.toString().padStart(2, "0")}h`;
  }

  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
};