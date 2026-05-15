import { useState } from "react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableArtist from "@/components/SortableArtist";

export default function VoteAdmin({
  defaultArtists,
  onPublish,
  isAfterVote,
}) {
  const [items, setItems] = useState(defaultArtists);

  const [loadingPublish, setLoadingPublish] = useState(false);
  const [loadingSimulation, setLoadingSimulation] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  // =========================
  // DND
  // =========================
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex(
        (i) => i.id === active.id
      );

      const newIndex = prev.findIndex(
        (i) => i.id === over.id
      );

      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  // =========================
  // FORMAT RANKING
  // =========================
  const formattedRanking = items.map((artist, index) => ({
    artist_id: String(artist.id),
    position: index + 1,
  }));

  // =========================
  // SUBMIT USER VOTE
  // =========================
  const submitVote = async () => {
    try {
      setLoadingSubmit(true);

      const res = await fetch(
        "https://eurovision-back.onrender.com/votes/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: 1,
            ranking: formattedRanking,
          }),
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      console.log("📊 LEADERBOARD:", data);

      // 👉 ici tu peux stocker le leaderboard
      localStorage.setItem(
        "leaderboard",
        JSON.stringify(data.leaderboard || [])
      );

      alert("✅ Vote envoyé + classement calculé");

      // option : refresh UI
      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("❌ Erreur envoi vote");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // =========================
  // OFFICIAL PUBLISH
  // =========================
  const publishOfficial = async () => {
    try {
      setLoadingPublish(true);

      const res = await fetch(
        "https://eurovision-back.onrender.com/votes/publish",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            results: items,
            published: true,
          }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      alert("✅ Résultats publiés");

      onPublish(items);
    } catch (err) {
      console.error(err);
      alert("❌ Erreur publication");
    } finally {
      setLoadingPublish(false);
    }
  };

  // =========================
  // SIMULATION
  // =========================
  const publishFake = async () => {
    try {
      setLoadingSimulation(true);

      const res = await fetch(
        "https://eurovision-back.onrender.com/leaderboard/simulate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            results: items.map((a) => ({
              id: a.id,
            })),
          }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      console.log("🧪 SIMULATION RESULT:", data);

      localStorage.setItem(
        "simulation_leaderboard",
        JSON.stringify(data)
      );

      alert("🧪 Simulation OK");
    } catch (err) {
      console.error(err);
      alert("❌ Erreur simulation");
    } finally {
      setLoadingSimulation(false);
    }
  };

  return (
    <div>

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

      {/* ACTIONS */}
      <div className="space-y-3">

        {/* SUBMIT VOTE */}
        <button
          onClick={submitVote}
          disabled={loadingSubmit}
          className="w-full py-3 rounded-xl bg-purple-500 text-white font-bold"
        >
          {loadingSubmit
            ? "⏳ Envoi..."
            : "🗳️ Envoyer vote"}
        </button>

      </div>
    </div>
  );
}