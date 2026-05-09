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

import {
  Clock,
  CheckCircle,
  LogOut,
} from "lucide-react";

const VOTE_DURATION = 20 * 60;
const VOTE_START_DATE = new Date("2026-05-16T21:00:00");

const VotePage = () => {

  const {
    user,
    submitRanking,
    hasVoted,
    logout
  } = useApp();

  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [now, setNow] = useState(new Date());

  const [showPanel, setShowPanel] = useState(true);
  
  const [voteStatus, setVoteStatus] = useState<
    "none" | "draft" | "submitted"
  >("none");

  const shuffled = useMemo(
    () => [...defaultArtists].sort(() => Math.random() - 0.5),
    []
  );

  const [items, setItems] = useState<Artist[]>(shuffled);

  // =========================
  // TIMER
  // =========================

  useEffect(() => {

    const i = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(i);

  }, []);

  // =========================
  // LOAD USER VOTE
  // =========================

  useEffect(() => {
    if (!user?.id) return;

    const loadVote = async () => {
      try {
        const res = await fetch(
          `https://eurovision-back.onrender.com/votes/${user.id}`
        );

        if (!res.ok) throw new Error("API error");

        const data = await res.json();

        if (data.error) {
          setVoteStatus("none");
          return;
        }

        setVoteStatus(data.status);

        if (data.ranking) {
          const sortedArtists = [...data.ranking]
            .sort((a, b) => a.position - b.position)
            .map((r) =>
              defaultArtists.find(a => a.id === r.artist_id)
            )
            .filter(Boolean);

          setItems(sortedArtists as Artist[]);
        }

      } catch (e) {
        console.error("loadVote failed", e);
        setVoteStatus("none"); // fallback safe
      }
    };

    loadVote();
  }, [user?.id]);

  // =========================
  // TIME
  // =========================

  const voteStart = VOTE_START_DATE.getTime();

  const voteEnd =
    voteStart + VOTE_DURATION * 1000;

  const nowMs = now.getTime();

  const isBeforeVote =
    nowMs < voteStart;

  const isVoteOpen =
    nowMs >= voteStart &&
    nowMs <= voteEnd;

  const isSubmitted =
    voteStatus === "submitted";

  const timeLeft = isBeforeVote

    ? Math.floor((voteStart - nowMs) / 1000)

    : Math.floor((voteEnd - nowMs) / 1000);

  // =========================
  // DND
  // =========================

  const sensors = useSensors(

    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5
      }
    })

  );

  const handleDragEnd = (
    event: DragEndEvent
  ) => {

    if (isSubmitted) return;

    const { active, over } = event;

    if (!over || active.id === over.id)
      return;

    setItems((prev) => {

      const oldIndex =
        prev.findIndex(
          (i) => i.id === active.id
        );

      const newIndex =
        prev.findIndex(
          (i) => i.id === over.id
        );

      return arrayMove(
        prev,
        oldIndex,
        newIndex
      );
    });
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async () => {

    if (!isVoteOpen) return;

    try {

      const res = await fetch(
        "https://eurovision-back.onrender.com/votes/",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id: user.id,

            ranking: items.map(
              (a, index) => ({
                artist_id: a.id,
                position: index + 1,
              })
            ),
          }),
        }
      );

      const data = await res.json();

      console.log(data);

      setVoteStatus("submitted");

      submitRanking(items);

      navigate("/results");

    } catch (e) {
      console.error(e);
    }
  };

  // =========================
  // SAVE DRAFT
  // =========================

  const saveDraft = async () => {

    try {

      const res = await fetch(
        "https://eurovision-back.onrender.com/votes/draft",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id: user.id,

            ranking: items.map(
              (a, index) => ({
                artist_id: a.id,
                position: index + 1,
              })
            ),
          }),
        }
      );

      const data = await res.json();

      console.log(data);

      setVoteStatus("draft");

      alert("💾 Brouillon sauvegardé !");

    } catch (e) {
      console.error(e);
    }
  };

  // =========================
  // SIMULATION
  // =========================

  const simulateResults = () => {

    const fake =
      [...defaultArtists]
        .sort(() => Math.random() - 0.5);

    localStorage.setItem(
      "fake_results",
      JSON.stringify(fake)
    );

    localStorage.setItem(
      "simulation_mode",
      "true"
    );

    localStorage.setItem(
      "user_ranking",
      JSON.stringify(items)
    );

    navigate("/results");
  };

  // =========================
  // NO USER
  // =========================

  if (user === undefined) {
    return <div className="text-white">Loading...</div>;
  }

  if (!user) return null;

  // =========================
  // ALREADY VOTED SCREEN
  // =========================

  if (hasVoted && isSubmitted) {

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

          <NeonButton
            onClick={() => navigate("/results")}
          >
            Voir les résultats
          </NeonButton>

        </motion.div>

      </div>
    );
  }

  // =========================
  // RENDER
  // =========================

  return (

    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto relative">

    {/* PANEL TOGGLE BUTTON (toujours visible) */}
    <button
      onClick={() => setShowPanel(!showPanel)}
      className="fixed right-4 top-24 z-50 px-3 py-2 rounded-full bg-black/70 border text-sm flex items-center gap-2"
    >
      <span className={`w-2 h-2 rounded-full ${showPanel ? "bg-green-400" : "bg-gray-500"}`} />
      {showPanel ? "Panel actif" : "Panel caché"}
    </button>

    {/* PANEL */}
{showPanel && (
  <div className="fixed right-4 top-36 w-72 rounded-xl border p-4 backdrop-blur-lg bg-black/40 space-y-4">

    {/* TITLE */}
    <h3 className="font-bold text-lg">
      État du vote
    </h3>

    {/* STATUS */}
    {voteStatus === "none" && (
      <div className="bg-red-500/20 border border-red-500 rounded-lg p-3">
        <p className="font-semibold text-red-400">
          ❌ Aucun vote sauvegardé
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Tu n’as encore rien enregistré.
        </p>
      </div>
    )}

    {voteStatus === "draft" && (
      <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3">
        <p className="font-semibold text-yellow-300">
          💾 Brouillon sauvegardé
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Tu peux encore modifier ton classement.
        </p>
      </div>
    )}

    {voteStatus === "submitted" && (
      <div className="bg-green-500/20 border border-green-500 rounded-lg p-3">
        <p className="font-semibold text-green-400">
          ✅ Vote validé
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Ton vote final a été enregistré.
        </p>
      </div>
    )}

    {/* ACTIONS */}
    <div className="flex flex-col gap-2 pt-2">

      <NeonButton
        onClick={handleSubmit}
        disabled={!isVoteOpen || isSubmitted}
        className="w-full py-2 text-sm"
      >
        🚀 Valider
      </NeonButton>

      <NeonButton
        onClick={saveDraft}
        disabled={isSubmitted}
        className="w-full py-2 text-sm border border-pink-500/40 text-pink-400 bg-transparent hover:bg-pink-500 hover:text-white"
      >
        💾 Sauvegarder
      </NeonButton>

      <NeonButton
        onClick={simulateResults}
        className="w-full py-2 text-sm border border-purple-500/40 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white"
      >
        🎲 Simuler
      </NeonButton>

    </div>

  </div>
)}
      {/* HEADER */}

      <div className="flex justify-between mb-6">

        <p className="text-sm text-muted-foreground">

          Connecté :{" "}

          <span className="text-foreground font-medium">
            {user.pseudo}
          </span>

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >

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
              isBeforeVote
                ? "text-gray-400"
                : "text-primary"
            }`}
          />

          <span className="font-display font-bold">

            {isBeforeVote

              ? `Début dans : ${formatTime(timeLeft)}`

              : `Fin dans : ${formatTime(timeLeft)}`}

          </span>

        </div>

        {/* LIST */}

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

        {/* BUTTONS */}

        <div className="space-y-3 mt-6">

          <NeonButton
            onClick={handleSubmit}
            disabled={!isVoteOpen || isSubmitted}
            className="w-full py-3 text-lg font-semibold"
          >
            🚀 Valider mon classement
          </NeonButton>

          <NeonButton
            onClick={saveDraft}
            disabled={isSubmitted}
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

// =========================
// HELPER
// =========================

const formatTime = (s: number) => {

  const days =
    Math.floor(s / 86400);

  const h =
    Math.floor((s % 86400) / 3600);

  const m =
    Math.floor((s % 3600) / 60);

  const sec =
    s % 60;

  if (days > 0) {

    return `${days}j ${h
      .toString()
      .padStart(2, "0")}h`;
  }

  return `${h
    .toString()
    .padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
};