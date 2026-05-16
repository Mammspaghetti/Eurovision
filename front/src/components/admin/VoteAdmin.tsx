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
  onSubmit,
}: {
  defaultArtists: any[];
  onSubmit: (ranking: any[]) => void;
}) {
  const [items, setItems] = useState(defaultArtists);

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
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);

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
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
    try {
      setLoadingSubmit(true);
      await onSubmit(formattedRanking);
    } finally {
      setLoadingSubmit(false);
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
      <button
        onClick={handleSubmit}
        disabled={loadingSubmit}
        className="w-full py-3 rounded-xl bg-purple-500 text-white font-bold"
      >
        {loadingSubmit ? "⏳ Envoi..." : "🗳️ Envoyer vote"}
      </button>
    </div>
  );
}