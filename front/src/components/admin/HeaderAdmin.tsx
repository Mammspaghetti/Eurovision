import { useEffect, useState } from "react";

const VOTE_DURATION = 20 * 60;
const VOTE_START_DATE = new Date("2026-05-16T21:00:00");

export default function HeaderAdmin({ published }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const voteStart = VOTE_START_DATE.getTime();
  const voteEnd = voteStart + VOTE_DURATION * 1000;
  const nowMs = now.getTime();

  const isAfterVote = nowMs > voteEnd;

  const formatTime = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const timeLeft = isAfterVote ? 0 : voteEnd - nowMs;

  return (
    <div className="mb-6 p-4 rounded-lg border bg-card">

      <h1 className="text-2xl font-bold mb-2">
        🛠 Admin - Classement final
      </h1>

      {!isAfterVote && (
        <p className="text-yellow-400 mb-2">
          ⏳ Validation bloquée
        </p>
      )}

      <p className="mb-2">
        🕒 Temps restant : <b>{formatTime(timeLeft)}</b>
      </p>

      <p>
        Statut :{" "}
        {published ? (
          <span className="text-green-400">PUBLIÉ</span>
        ) : (
          <span className="text-yellow-400">EN ATTENTE</span>
        )}
      </p>

    </div>
  );
}