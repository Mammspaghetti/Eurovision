import { useEffect, useState } from "react";

type Props = {
  leaderboard: any[];
  loading?: boolean;
  onClose: () => void;
};

export default function ResultAdminPopup({
  leaderboard,
  loading,
  onClose,
}: Props) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    if (!leaderboard.length) return;

    const interval = setInterval(() => {
      setVisible((v) => {
        if (v >= leaderboard.length) {
          clearInterval(interval);
          return v;
        }
        return v + 1;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [leaderboard]);

  const getMedalStyle = (i: number) => {
    if (i === 0) return "border-yellow-400 bg-yellow-500/10";
    if (i === 1) return "border-gray-400 bg-gray-500/10";
    if (i === 2) return "border-orange-400 bg-orange-500/10";
    return "border-border bg-card";
  };

  const getMedal = (i: number) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return `#${i + 1}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="w-[420px] bg-card border rounded-2xl shadow-2xl p-5 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-white"
        >
          ✖
        </button>

        {/* TITLE */}
        <h2 className="text-lg font-bold mb-4 text-white">
          🏆 Classement final
        </h2>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-muted-foreground py-6">
            Chargement...
          </p>
        )}

        {/* LIST */}
        <div className="space-y-2 max-h-[420px] overflow-auto pr-1">

          {leaderboard.slice(0, visible).map((u, i) => (
            <div
              key={u.user_id}
              className={`
                flex justify-between items-center
                p-3 rounded-xl border
                transition-all duration-300
                ${getMedalStyle(i)}
              `}
            >

              <div className="flex items-center gap-3">
                <span className="font-bold w-10 text-center text-white/80">
                  {getMedal(i)}
                </span>

                <div>
                  <p className="font-semibold text-white">
                    User {u.user_id}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    position {i + 1}/{leaderboard.length}
                  </p>
                </div>
              </div>

              <p className="font-bold text-primary text-lg">
                {u.score}
              </p>

            </div>
          ))}

        </div>

        {/* FOOTER */}
        {visible >= leaderboard.length && !loading && (
          <div className="text-center mt-4 text-sm text-green-400 font-semibold">
            Classement final affiché
          </div>
        )}

      </div>
    </div>
  );
}