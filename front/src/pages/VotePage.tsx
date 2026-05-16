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

import { CheckCircle, LogOut } from "lucide-react";

const VotePage = () => {
  const { user, submitRanking, logout } = useApp();
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================
  const [items, setItems] = useState<Artist[]>(() =>
    [...defaultArtists].sort(() => Math.random() - 0.5)
  );

  const [voteStatus, setVoteStatus] = useState<"none" | "submitted">("none");
  const [hasVote, setHasVote] = useState<boolean | null>(null);
  
  const [published, setPublished] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [finalResult, setFinalResult] = useState<any>(null);
  const isSubmitted = voteStatus === "submitted";
  const isFinalPublished =
    published === true && leaderboard.length > 0;

  const [isEditing, setIsEditing] = useState(false);



  // =========================
  // LOAD VOTE USER
  // =========================
  useEffect(() => {
    if (!user?.id) return;

    const loadVote = async () => {
      const res = await fetch(
        `https://eurovision-back.onrender.com/votes/${user.id}`
      );

      const data = await res.json();

      // CAS 1 : pas de vote
      if (!data || data.error || !data.ranking?.length) {
        setHasVote(false);
        setVoteStatus("none");
        setItems([...defaultArtists]); // 🔥 IMPORTANT
        return;
      }

      // CAS 2 : vote existant
      setHasVote(true);
      setVoteStatus(data.status);

      const sorted = [...data.ranking]
        .sort((a: any, b: any) => a.position - b.position)
        .map((r: any) =>
          defaultArtists.find((a) => a.id === r.artist_id)
        )
        .filter(Boolean);

      setItems(sorted as Artist[]);
    };

    loadVote();
  }, [user?.id]);

  // =========================
  // LOAD FINAL RESULTS
  // =========================
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const res = await fetch(
          "https://eurovision-back.onrender.com/votes/final"
        );

        const data = await res.json();

        setPublished(data.published === true);
      } catch (e) {
        console.error(e);
        setPublished(false);
      }
    };

    loadStatus();
  }, []);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const res = await fetch(
          "https://eurovision-back.onrender.com/leaderboard/"
        );

        const data = await res.json();

        setLeaderboard(data || []);
      } catch (e) {
        console.error(e);
        setLeaderboard([]);
      }
    };

    loadLeaderboard();
  }, []);

  // =========================
  // DND
  // =========================
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (isSubmitted && !isEditing) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  // =========================
  // SUBMIT / UPDATE VOTE
  // =========================
  const handleSubmit = async () => {
    if (!user?.id) return;

    const payload = {
      user_id: user.id,
      ranking: items.map((a, i) => ({
        artist_id: a.id,
        position: i + 1,
      })),
    };

    const url = hasVote
      ? "https://eurovision-back.onrender.com/votes/update"
      : "https://eurovision-back.onrender.com/votes/submit";

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setHasVote(true);
    setVoteStatus("submitted");
    submitRanking(items);
  };

  const enableEdit = () => setIsEditing(true);

  // =========================
  // SIMULATION
  // =========================
  const simulate = () => {
    localStorage.setItem("simulation_mode", "true");
    localStorage.setItem("user_ranking", JSON.stringify(items));

    navigate("/results?mode=simulation");
  };

  // =========================
  // GUARD
  // =========================
  if (!user) return null;

  // =========================
  // UI LOCK (POST VOTE VIEW)
  // =========================
  if (isSubmitted && !isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">

          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />

          <h2 className="font-display text-3xl font-bold mb-2">
            Vote enregistré
          </h2>

          <p className="text-muted-foreground mb-6">
            Tu peux modifier ou simuler ton résultat
          </p>

          <div className="flex flex-col gap-3">

            <NeonButton onClick={() => navigate("/results?mode=final")}>
              Voir résultats (si publiés)
            </NeonButton>

            <NeonButton
              onClick={enableEdit}
              className="border border-pink-500/40 text-pink-400 bg-transparent hover:bg-pink-500 hover:text-white"
            >
              ✏️ Changer mon vote
            </NeonButton>

            <NeonButton
              onClick={simulate}
              className="border border-purple-500/40 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white"
            >
              🎲 Simulation
            </NeonButton>

          </div>
        </motion.div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Connecté : <span className="font-medium">{user.pseudo}</span>
        </p>

        <button onClick={() => { logout(); navigate("/"); }}>
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        <h1 className="font-display text-3xl font-bold mb-1">
          {isSubmitted ? "Modifier ton vote" : "Fais ton classement"}
        </h1>

        <p className="text-muted-foreground mb-4">
          Classe les artistes du meilleur au pire
        </p>

        {/* LIST */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((a) => a.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 mb-6">
              {items.map((artist, index) => (
                <SortableArtist key={artist.id} artist={artist} index={index} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* ACTIONS */}
        <div className="space-y-3">

          {/* SUBMIT / UPDATE */}
          <NeonButton
            onClick={handleSubmit}
            className="w-full py-3 text-lg"
          >
            {isSubmitted ? "💾 Mettre à jour mon vote" : "🚀 Valider mon vote"}
          </NeonButton>

          {/* SIMULATION */}
          <NeonButton
            onClick={simulate}
            className="w-full py-3 border border-purple-500/40 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white"
          >
            🎲 Simulation
          </NeonButton>

          {/* OFFICIAL RESULTS */}
          <NeonButton
            disabled={!isFinalPublished}
            onClick={() => {
              if (!isFinalPublished) return;
              navigate("/results?mode=final");
            }}
            className={`w-full py-3 border transition-all ${
              isFinalPublished
                ? "border-green-500/40 text-green-400 hover:bg-green-500 hover:text-white"
                : "border-gray-600 text-gray-500 opacity-40 cursor-not-allowed pointer-events-none"
            }`}
          >
            🏆 Résultats officiels
          </NeonButton>

        </div>

      </motion.div>
    </div>
  );
};

export default VotePage;