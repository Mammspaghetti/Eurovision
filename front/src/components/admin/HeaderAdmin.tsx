export default function HeaderAdmin({
  published,
  isAfterVote,
  voteEnd,
  now,
}) {

  const formatTime = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const timeLeft = isAfterVote ? 0 : voteEnd - now.getTime();

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