import { Artist } from "@/data/artists";

type Props = {
  ranking: Artist[];
  realResults: Artist[];
};

const calculatePoints = (userIdx: number, realIdx: number) => {
  if (userIdx < 3) {
    if (userIdx === realIdx) return 300;
    if (realIdx < 3) return 200;
    return 100;
  }

  const diff = Math.abs(realIdx - userIdx);
  return Math.max(0, 100 - diff * 10);
};

const getStatus = (diff: number) => {
  if (diff === 0) return "perfect";
  if (Math.abs(diff) <= 2) return "close";
  return "bad";
};

const ResultsComparison = ({ ranking, realResults }: Props) => {
  if (!ranking?.length) return null;

  return (
    <div className="space-y-3 mb-6">

      {ranking.map((artist, userIdx) => {
        const realIdx = realResults.findIndex(a => a.id === artist.id);

        const diff = realIdx - userIdx;
        const points = calculatePoints(userIdx, realIdx);

        const status = getStatus(diff);

        const cardStyle =
          status === "perfect"
            ? "border-green-400 bg-green-500/10"
            : status === "close"
              ? "border-orange-400 bg-orange-500/10"
              : "border-violet-400 bg-violet-500/10";

        const badge =
          status === "perfect"
            ? "🟢 Parfait"
            : status === "close"
              ? "🟠 Proche"
              : "🔴 Écarté";

        return (
          <div
            key={artist.id}
            className={`p-3 rounded-xl border flex items-center justify-between ${cardStyle}`}
          >

            {/* LEFT */}
            <div className="flex flex-col">
              <div className="font-semibold">
                #{userIdx + 1} — {artist.artist}
              </div>

              <div className="text-xs opacity-70">
                {badge}
              </div>
            </div>

            {/* CENTER */}
            <div className="text-center text-sm">
              <div className="font-bold">
                Réel #{realIdx + 1}
              </div>

              <div className="text-xs opacity-70">
                Δ {diff > 0 ? "+" : ""}{diff}
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                +{points}
              </div>

              <div className="text-xs opacity-70">
                pts
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default ResultsComparison;