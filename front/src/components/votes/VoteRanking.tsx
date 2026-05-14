import { useState, useMemo } from "react";
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

import { artists as defaultArtists, Artist } from "@/data/artists";
import SortableArtist from "@/components/SortableArtist";

interface Props {
  onChange: (items: Artist[]) => void;
  items: Artist[];
  disabled?: boolean;
}

export default function VoteRanking({
  onChange,
  items,
  disabled,
}: Props) {

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (disabled) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);

    onChange(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(a => a.id)} strategy={verticalListSortingStrategy}>

        <div className="space-y-2 mb-6">
          {items.map((artist, index) => (
            <SortableArtist key={artist.id} artist={artist} index={index} />
          ))}
        </div>

      </SortableContext>
    </DndContext>
  );
}