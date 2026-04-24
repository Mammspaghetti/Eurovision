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

export default function ResultAdmin({
  defaultArtists,
  onPublish,
  isAfterVote,
}) {
  const [items, setItems] = useState(defaultArtists);

  // 🧲 sensors (copié VotePage)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  // 🔀 drag & drop
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  // 🧪 fake
  const fakePublish = () => {
    localStorage.setItem("final_results", JSON.stringify(items));
    localStorage.setItem("simulation_mode", "true");
    alert("🧪 Résultat simulé !");
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
          onClick={() => onPublish(items)}
          disabled={!isAfterVote}
          className={`w-full py-3 rounded-xl font-bold text-white ${
            isAfterVote ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {isAfterVote
            ? "✅ Valider officiellement"
            : "⏳ Après le vote"}
        </button>

        {/* TEST */}
        <button
          onClick={fakePublish}
          className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold"
        >
          🧪 Simulation
        </button>

      </div>

    </div>
  );
}