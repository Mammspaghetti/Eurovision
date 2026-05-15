import { useState, useEffect } from "react";

export default function ResultAdmin() {

  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const fetchLeaderboard = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        "https://eurovision-back.onrender.com/leaderboard/"
      );

      const data = await res.json();
      setLeaderboard(data);

    } catch (e) {
      console.error(e);
      alert("Erreur chargement leaderboard");
    }

    setLoading(false);
  };

  // auto load au montage
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="p-4 space-y-4">

      {/* BUTTON REFRESH */}
      <button
        onClick={fetchLeaderboard}
        disabled={loading}
        className="
          w-full py-3 rounded-xl
          bg-green-500 text-white font-bold
        "
      >
        {loading ? "Chargement..." : "🔄 Rafraîchir classement"}
      </button>

      {/* LEADERBOARD */}
      <div className="space-y-2 mt-4">
        {leaderboard.map((u) => (
          <div
            key={u.user_id}
            className="
              flex justify-between items-center
              p-3 rounded-lg border bg-card
            "
          >
            <div>
              <p className="font-bold">{u.pseudo || `User ${u.user_id}`}</p>
              <p className="text-xs text-muted-foreground">
                #{u.rank} • {u.status}
              </p>
            </div>

            <p className="text-xl font-bold text-primary">
              {u.score}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}