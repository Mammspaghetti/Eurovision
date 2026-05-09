import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useApp } from "@/context/AppContext";
import { artists as defaultArtists, Artist } from "@/data/artists";
import SortableArtist from "@/components/SortableArtist";
import NeonButton from "@/components/NeonButton";
import { Clock, CheckCircle, LogOut } from "lucide-react";

const API = "https://eurovision-back.onrender.com";

const VOTE_DURATION = 20 * 60;
const VOTE_START_DATE = new Date("2026-05-16T21:00:00");

const VotePage = () => {
  const { user, submitRanking, hasVoted, logout } = useApp();
  const navigate = useNavigate();

  const [now, setNow] = useState(new Date());
  const [voteStatus, setVoteStatus] = useState<"none" | "draft" | "submitted">("none");

  const shuffled = useMemo(
    () => [...defaultArtists].sort(() => Math.random() - 0.5),
    []
  );

  const [items, setItems] = useState<Artist[]>(shuffled);

  // TIMER
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  // LOAD USER
  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      try {
        const res = await fetch(`${API}/votes/${user.id}`);

        if (!res.ok) {
          setVoteStatus("none");
          return;
        }

        const data = await res.json().catch(() => null);
        if (!data) return setVoteStatus("none");

        setVoteStatus(data.status ?? "none");

        if (Array.isArray(data.ranking)) {
          const sorted = [...data.ranking]
            .sort((a, b) => a.position - b.position)
            .map((r) => defaultArtists.find((a) => a.id === r.artist_id))
            .filter(Boolean) as Artist[];

          setItems(sorted);
        }
      } catch (e) {
        console.error("load vote error", e);
        setVoteStatus("none");
      }
    };

    load();
  }, [user]);

  const voteStart = VOTE_START_DATE.getTime();
  const voteEnd = voteStart + VOTE_DURATION * 1000;
  const nowMs = now.getTime();

  const isBeforeVote = nowMs < voteStart;
  const isVoteOpen = nowMs >= voteStart && nowMs <= voteEnd;
  const isSubmitted = voteStatus === "submitted";

  const timeLeft = isBeforeVote
    ? Math.floor((voteStart - nowMs) / 1000)
    : Math.floor((voteEnd - nowMs) / 1000);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = (event) => {
    if (isSubmitted) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSubmit = async () => {
    if (!isVoteOpen || !user) return;

    const res = await fetch(`${API}/votes/`, {
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

    if (!res.ok) return;

    setVoteStatus("submitted");
    submitRanking(items);
    navigate("/results");
  };

  const saveDraft = async () => {
    if (!user) return;

    const res = await fetch(`${API}/votes/draft`, {
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

    if (res.ok) {
      setVoteStatus("draft");
      alert("💾 Brouillon sauvegardé !");
    }
  };

  if (!user) return null;

  if (hasVoted && isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Vote enregistré</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 py-6">

      <div className="flex justify-between mb-4">
        <span>Connecté : {user.pseudo}</span>
        <button onClick={() => { logout(); navigate("/"); }}>
          <LogOut />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Clock />
        <span>{isBeforeVote ? "Début dans" : "Fin dans"} {timeLeft}s</span>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          {items.map((a, i) => (
            <SortableArtist key={a.id} artist={a} index={i} />
          ))}
        </SortableContext>
      </DndContext>

      <div className="space-y-3 mt-6">
        <NeonButton onClick={handleSubmit} disabled={!isVoteOpen || isSubmitted}>
          Valider
        </NeonButton>

        <NeonButton onClick={saveDraft} disabled={isSubmitted}>
          Sauvegarder
        </NeonButton>
      </div>

    </div>
  );
};

export default VotePage;