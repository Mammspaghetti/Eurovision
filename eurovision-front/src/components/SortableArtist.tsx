import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ExternalLink } from "lucide-react";
import { Artist } from "@/data/artists";

interface Props {
  artist: Artist;
  index: number;
}

const SortableArtist = ({ artist, index }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: artist.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        isDragging
          ? "bg-primary/20 border-primary/50 box-glow scale-[1.02] z-50 shadow-lg shadow-primary/20"
          : "bg-card/60 border-border hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors touch-none"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold font-display text-primary flex-shrink-0">
        {index + 1}
      </span>
      <img
        src={artist.photoUrl}
        alt={artist.artist}
        className="w-10 h-10 rounded-full object-cover border-2 border-border flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.artist)}&background=7c3aed&color=fff&size=40`;
        }}
      />
      <span className="text-xl flex-shrink-0">{artist.flag}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate text-sm">{artist.artist}</p>
        <p className="text-xs text-muted-foreground truncate">{artist.country} — <em>{artist.song}</em></p>
      </div>
      <a
        href={artist.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
};

export default SortableArtist;
