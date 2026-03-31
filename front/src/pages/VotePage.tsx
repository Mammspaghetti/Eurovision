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

const VOTE_DURATION = 20 * 60; // 20 minutes

const VotePage = () => {
  const { user, submitRanking, hasVoted, logout } = useApp();
  const navigate = useNavigate();

  const shuffled = useMemo(() => {
    const arr = [...defaultArtists];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const [items, setItems] = useState<Artist[]>(shuffled);
  const [timeLeft, setTimeLeft] = useState(VOTE_DURATION);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (hasVoted) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasVoted]);

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

  const handleSubmit = () => {
    submitRanking(items);
    navigate("/results");
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  if (!user) return null;

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
          <NeonButton onClick={() => navigate("/results")}>Voir les résultats</NeonButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Connecté : <span className="text-foreground font-medium">{user.pseudo}</span></p>
        </div>
        <button onClick={() => { logout(); navigate("/"); }} className="text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-glow mb-1">Fais ton classement</h1>
        <p className="text-muted-foreground mb-4">Classe les artistes du meilleur au pire</p>

        {/* Timer */}
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border mb-6 ${
          timeLeft < 60 ? "border-accent bg-accent/10" : "border-border bg-card/60"
        }`}>
          <Clock className={`w-4 h-4 ${timeLeft < 60 ? "text-accent" : "text-primary"}`} />
          <span className={`font-display font-bold ${timeLeft < 60 ? "text-accent" : "text-foreground"}`}>
            Fin des votes dans : {formatTime(timeLeft)}
          </span>
        </div>

        {/* Artist list */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((a) => a.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 mb-6">
              {items.map((artist, index) => (
                <SortableArtist key={artist.id} artist={artist} index={index} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <NeonButton onClick={handleSubmit} disabled={timeLeft === 0} className="w-full">
          {timeLeft === 0 ? "Temps écoulé !" : "Valider mon classement ✓"}
        </NeonButton>
      </motion.div>
    </div>
  );
};

export default VotePage;
