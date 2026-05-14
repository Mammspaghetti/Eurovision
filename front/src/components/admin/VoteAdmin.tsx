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
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  // =========================
  // OFFICIEL
  // =========================
  const publishOfficial = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://eurovision-back.onrender.com/votes/publish",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            results: items,
            published: true,
          }),
        }
      );

      if (!res.ok) throw new Error();

      alert("✅ Résultats officiels publiés");
      onPublish(items);
    } catch (err) {
      console.error(err);
      alert("❌ Erreur publication");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SIMULATION (faux vote)
  // =========================
  const publishFake = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://eurovision-back.onrender.com/leaderboard/simulate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            results: items,
          }),
        }
      );

      const data = await res.json();

      console.log("🧪 SIMULATION RESULT:", data);

      // tu peux stocker localement si tu veux
      localStorage.setItem("simulation_leaderboard", JSON.stringify(data));

      alert("🧪 Simulation OK");
    } catch (e) {
      console.error(e);
      alert("❌ erreur simulation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* LISTE DRAG */}
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

        {/* OFFICIEL */}
        <button
          onClick={publishOfficial}
          disabled={!isAfterVote || loading}
          className={`w-full py-3 rounded-xl font-bold text-white ${
            isAfterVote ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {isAfterVote
            ? loading
              ? "⏳ Publication..."
              : "✅ Valider officiellement"
            : "⏳ Après le vote"}
        </button>

        {/* SIMULATION */}
        <button
          onClick={publishFake}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold"
        >
          🧪 Simulation (test)
        </button>

      </div>

    </div>
  );
}