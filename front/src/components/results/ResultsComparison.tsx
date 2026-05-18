import { Artist, artists as allArtists } from "@/data/artists";

type Props = {
  ranking: Artist[];
  realResults: any[];
};

// =========================
// SCORE (backend-like)
// =========================
const calculatePoints = (diff: number) => {
  const abs = Math.abs(diff);

  if (abs === 0) return 300;
  if (abs <= 2) return 200;
  if (abs <= 5) return 100;
  return Math.max(0, 50 - abs * 2);
};

const getArrow = (diff: number) => {
  if (diff > 0) return "⬇"; // user trop haut → real plus bas
  if (diff < 0) return "⬆"; // user trop bas → real plus haut
  return "➡";
};

const ResultsComparison = ({ ranking, realResults }: Props) => {
  if (!ranking?.length || !realResults?.length) return null;

  // =========================
  // REAL MAP (artist_id → position)
  // =========================
  const realMap = new Map(
    realResults.map((r) => [String(r.artist_id), r.position])
  );

  // =========================
  // ARTIST MAP (source data)
  // =========================
  const artistMap = new Map(
    allArtists.map((a: any) => [String(a.id), a])
  );

  return (
    <div className="space-y-3 mb-6">

      {ranking.map((artist, userIdx) => {
        const artistId = String(artist.id);

        const userPos = userIdx + 1;
        const realPos = realMap.get(artistId);

        if (realPos === undefined) return null;

        const diff = realPos - userPos;
        const points = calculatePoints(diff);

        const status =
          diff === 0
            ? "perfect"
            : Math.abs(diff) <= 2
              ? "close"
              : "bad";

        const realArtist = artistMap.get(artistId);
        const userArtist = artist;

        const cardStyle =
          status === "perfect"
            ? "border-green-400 bg-green-500/10"
            : status === "close"
              ? "border-orange-400 bg-orange-500/10"
              : "border-red-400 bg-red-500/10";

        return (
          <div
            key={artist.id}
            className={`grid grid-cols-5 items-center p-3 rounded-xl border gap-2 ${cardStyle}`}
          >

            {/* =========================
                REAL (FINAL) - TOP
            ========================= */}
            <div>
              <div className="font-bold text-primary">
                #{realPos}
              </div>
              <div className="text-sm font-semibold">
                {realArtist?.artist}
              </div>
              <div className="text-xs opacity-70">
                {realArtist?.country}
              </div>
              <div className="text-xs opacity-60">
                Real (Final)
              </div>
            </div>

            {/* =========================
                USER VOTE
            ========================= */}
            <div>
              <div className="font-bold">
                #{userPos}
              </div>
              <div className="text-sm">
                {userArtist.artist}
              </div>
              <div className="text-xs opacity-70">
                {userArtist.country}
              </div>
              <div className="text-xs opacity-60">
                User
              </div>
            </div>

            {/* =========================
                DIFF
            ========================= */}
            <div className="text-center">
              <div className="text-lg font-bold">
                {getArrow(diff)} {diff > 0 ? "-" : diff < 0 ? "+" : ""}
                {Math.abs(diff)}
              </div>

              <div className="text-xs opacity-70">
                Δ position
              </div>

              <div className="text-xs font-semibold">
                {status === "perfect"
                  ? "🟢 Exact"
                  : status === "close"
                    ? "🟠 Proche"
                    : "🔴 Écarté"}
              </div>
            </div>

            {/* =========================
                POINTS
            ========================= */}
            <div className="text-right col-span-2">
              <div className="text-xl font-bold text-primary">
                +{points}
              </div>
              <div className="text-xs opacity-70">
                points gagnés
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default ResultsComparison;