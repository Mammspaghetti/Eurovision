import { Clock } from "lucide-react";

interface Props {
  timeLeft: number;
  isBeforeVote: boolean;
}

export default function VoteTimer({ timeLeft, isBeforeVote }: Props) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Clock className="w-4 h-4" />
      <span>
        {isBeforeVote ? "Début dans : " : "Fin dans : "}
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

const formatTime = (s: number) => {
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  if (days > 0) {
    return `${days}j ${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds
      .toString()
      .padStart(2, "0")}s`;
  }

  return `${minutes.toString().padStart(2, "0")}m ${seconds
    .toString()
    .padStart(2, "0")}s`;
};