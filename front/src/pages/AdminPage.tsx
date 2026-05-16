import { useEffect, useState } from "react";

type Props = {
  leaderboard: any[];
  onClose: () => void;
};

export default function ResultAdminPopup({ leaderboard, onClose }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);

    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= leaderboard.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 600); // vitesse suspense

    return () => clearInterval(interval);
  }, [leaderboard]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-lg rounded-xl p-5 shadow-2xl">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">🏆 Résultats</h2>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="space-y-2">
          {leaderboard.slice(0, visibleCount).map((u, i) => (
            <div
              key={u.user_id}
              className="flex justify-between p-3 rounded-lg bg-gray-100 animate-fadeIn"
            >
              <span className="font-semibold">
                {i + 1}. User {u.user_id}
              </span>

              <span className="font-bold text-purple-600">
                {u.score}
              </span>
            </div>
          ))}
        </div>

        {visibleCount >= leaderboard.length && (
          <p className="text-center mt-4 font-bold text-green-600 animate-pulse">
            🎉 Classement terminé !
          </p>
        )}
      </div>
    </div>
  );
}