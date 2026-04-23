import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ExternalLink } from "lucide-react";
import { useState } from "react";

const SortableArtist = ({ artist, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: artist.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // 🖼️ image fallback propre
  const [imgError, setImgError] = useState(false);

  const imageSrc = imgError
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.artist)}&background=7c3aed&color=fff`
    : artist.photoUrl;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        isDragging
          ? "bg-primary/20 border-primary/50 scale-[1.02] shadow-lg shadow-primary/20"
          : "bg-card/60 border-border hover:border-primary/30"
      }`}
    >

      {/* DRAG */}
      <div {...attributes} {...listeners} className="cursor-grab touch-none">
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* RANK */}
      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">
        {index + 1}
      </span>

      {/* IMAGE */}
      <img
        src={imageSrc}
        alt={artist.artist}
        onError={() => setImgError(true)}
        className="w-11 h-11 rounded-full object-cover border border-border"
      />

      {/* INFO */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">
          {artist.artist}
        </p>

        <p className="text-xs text-muted-foreground truncate">
          {artist.flag} {artist.country} • {artist.song}
        </p>
      </div>

      {/* LINK */}
      <a
        href={artist.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
};

export default SortableArtist;