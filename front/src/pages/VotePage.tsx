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

/**
 * ⏱️ CONFIG
 */
const VOTE_DURATION = 20 * 60; // 20 minutes en secondes
const VOTE_START_DATE = new Date("2026-05-16T21:00:00");

const VotePage = () => {
  const { user, submitRanking, hasVoted, logout } = useApp();
  const navigate = useNavigate();

  /**
   * ⏰ Etat temps réel (IMPORTANT)
   * → permet de recalculer le timer chaque seconde
   */
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /**
   * 🧠 Calcul des états du vote
   */
  const voteStart = VOTE_START_DATE.getTime();
  const voteEnd = voteStart + VOTE_DURATION * 1000;
  const nowMs = now.getTime();

  const isBeforeVote = nowMs < voteStart;
  const isVoteOpen = nowMs >= voteStart && nowMs <= voteEnd;
  const isVoteClosed = nowMs > voteEnd;

  /**
   * ⏳ Calcul du temps restant
   */
  const timeLeft = isBeforeVote
    ? Math.floor((voteStart - nowMs) / 1000)
    : isVoteOpen
      ? Math.floor((voteEnd - nowMs) / 1000)
      : 0;

  /**
   * 🔀 Shuffle des artistes (UNE seule fois)
   */
  const shuffled = useMemo(() => {
    const arr = [...defaultArtists];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const [items, setItems] = useState<Artist[]>(shuffled);

  /**
   * 🖱️ Drag & Drop sensors
   */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  /**
   * 🔐 Redirection si pas connecté
   */
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  /**
   * 🔄 Gestion du drag
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  /**
   * ✅ Submit vote
   */
  const handleSubmit = () => {
    if (!isVoteOpen) return; // sécurité front
    submitRanking(items);
    navigate("/results");
  };

  /**
   * ⏱️ Format dd:hh:mm:ss
   */
  const formatTime = (s: number) => {
    const days = Math.floor(s / (3600 * 24));
    const hours = Math.floor((s % (3600 * 24)) / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    return `${days.toString().padStart(2, "0")} jours & ` +
          `${hours.toString().padStart(2, "0")}:` +
          `${minutes.toString().padStart(2, "0")}:` +
          `${seconds.toString().padStart(2, "0")}`;
  };

  if (!user) return null;

  /**
   * ✅ Etat après vote
   */
  if (hasVoted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="text-center"
        >
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-glow mb-2">Vote enregistré !</h2>
          <p className="text-muted-foreground mb-6">Rendez-vous pour les résultats 🎉</p>
          <NeonButton onClick={() => navigate("/results")}>
            Voir les résultats
          </NeonButton>
        </motion.div>
      </div>
    );
  }

  /**
   * 🎨 UI principale
   */
  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Connecté : <span className="text-foreground font-medium">{user.pseudo}</span>
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

        {/* ⏳ TIMER */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border mb-6">

          <Clock className={`w-4 h-4 ${
            isBeforeVote
              ? "text-gray-400"
              : timeLeft < 60
                ? "text-accent"
                : "text-primary"
          }`} />

          <span className="font-display font-bold">
            {isBeforeVote && `Début des votes dans : ${formatTime(timeLeft)}`}
            {isVoteOpen && `Fin des votes dans : ${formatTime(timeLeft)}`}
            {isVoteClosed && "Votes terminés"}
          </span>
        </div>

        {/* 🎵 LISTE */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((a) => a.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 mb-6">
              {items.map((artist, index) => (
                <SortableArtist key={artist.id} artist={artist} index={index} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* 🔘 BOUTON */}
        <NeonButton
          onClick={handleSubmit}
          disabled={!isVoteOpen}
          className="w-full py-3 text-lg font-semibold"
        >
          {isBeforeVote && "⏳ Vote pas encore ouvert"}
          {isVoteOpen && "🚀 Valider mon classement"}
          {isVoteClosed && "❌ Temps écoulé"}
        </NeonButton>
        <NeonButton
          onClick={() => {
            localStorage.setItem("vote_draft", JSON.stringify(items));
          }}
          className="
            w-full mt-3 py-3
            bg-transparent border border-pink-500/40
            text-pink-400 font-medium
            hover:bg-pink-500 hover:text-white
            hover:shadow-lg hover:shadow-pink-500/30
            transition-all duration-200
          "
        >
          💾 Enregistrer mon vote
        </NeonButton>

      </motion.div>
    </div>
  );
};

export default VotePage;