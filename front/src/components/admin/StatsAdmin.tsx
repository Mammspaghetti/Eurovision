import { useMemo } from "react";

export default function StatsAdmin({ users = [], votes = [] }) {

  // 👥 total users
  const totalUsers = users.length;

  // 🧠 map votes (user_id -> vote)
  const voteMap = useMemo(() => {
    const map = new Map();

    if (!Array.isArray(votes)) return map;

    votes.forEach((v) => {
      map.set(v.user_id, v);
    });

    return map;
  }, [votes]);

  // 🔥 enrich users avec statut vote
  const enrichedUsers = useMemo(() => {
    return users.map((u) => {
      const vote = voteMap.get(u.id);

      return {
        ...u,
        voted: !!vote,
        ranking: vote?.ranking || []
      };
    });
  }, [users, voteMap]);

  const votedUsers = enrichedUsers.filter((u) => u.voted);
  const notVotedUsers = enrichedUsers.filter((u) => !u.voted);

  return (
    <div className="space-y-4">

      {/* 🟦 GLOBAL STATS */}
      <div className="p-4 border rounded-lg bg-card space-y-2">

        <h2 className="text-xl font-bold">
          📊 Dashboard Admin
        </h2>

        {/* 👥 INSCRITS EN GROS */}
        <div className="text-3xl font-bold text-white">
          👥 {totalUsers} inscrits
        </div>

        <div className="flex gap-4 text-sm">
          <span className="text-green-400">
            🗳️ {votedUsers.length} ont voté
          </span>

          <span className="text-yellow-400">
            ⏳ {notVotedUsers.length} en attente
          </span>
        </div>

        {/* progress bar */}
        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{
              width: `${totalUsers ? (votedUsers.length / totalUsers) * 100 : 0}%`
            }}
          />
        </div>
      </div>

      {/* ✅ ONT VOTÉ */}
      <div className="p-4 border rounded-lg bg-card">

        <h3 className="font-bold text-green-400 mb-2">
          ✅ Ont voté ({votedUsers.length})
        </h3>

        {votedUsers.length === 0 ? (
          <p className="text-sm text-gray-400">Aucun vote</p>
        ) : (
          <ul className="space-y-1">
            {votedUsers.map((u) => (
              <li key={u.id} className="flex justify-between text-sm">
                <span>• {u.pseudo}</span>
                <span className="text-xs text-gray-400">
                  {u.ranking.length ? "✔ ranking OK" : "⚠ vide"}
                </span>
              </li>
            ))}
          </ul>
        )}

      </div>

      {/* ⏳ PAS VOTÉ */}
      <div className="p-4 border rounded-lg bg-card">

        <h3 className="font-bold text-yellow-400 mb-2">
          ⏳ Pas encore voté ({notVotedUsers.length})
        </h3>

        {notVotedUsers.length === 0 ? (
          <p className="text-sm text-gray-400">Tout le monde a voté 🎉</p>
        ) : (
          <ul className="space-y-1">
            {notVotedUsers.map((u) => (
              <li key={u.id} className="text-sm">
                • {u.pseudo} <span className="text-gray-500">({u.email})</span>
              </li>
            ))}
          </ul>
        )}

      </div>

    </div>
  );
}