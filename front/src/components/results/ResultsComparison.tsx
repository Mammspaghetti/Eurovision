import { Artist } from "@/data/artists";

type Props = {
  ranking: Artist[];
  realResults: Artist[];
};

const calculatePoints = (userIdx: number, realIdx: number) => {
  const diff = Math.abs(realIdx - userIdx);
  return Math.max(0, 100 - diff * 5);
};

const ResultsComparison = ({
  ranking,
  realResults,
}: Props) => {

  if (!ranking) return null;

  return (
    <div className="space-y-2 mb-6">

      {ranking.map((artist, userIdx) => {

        const realIdx =
          realResults.findIndex(
            a => a.id === artist.id
          );

        const points =
          calculatePoints(userIdx, realIdx);

        const diff = realIdx - userIdx;

        const color =
          diff === 0
            ? "border-green-400/40 bg-green-500/10"
            : Math.abs(diff) <= 2
              ? "border-orange-400/40 bg-orange-500/10"
              : "border-violet-400/30 bg-violet-500/10";

        return (
          <div
            key={artist.id}
            className={`flex justify-between p-3 rounded-lg border ${color}`}
          >

            <div>
              #{userIdx + 1} {artist.artist}
            </div>

            <div>
              {diff === 0
                ? "✓"
                : diff > 0
                  ? `- ${Math.abs(diff)}`
                  : `+ ${Math.abs(diff)}`}
            </div>

            <div>
              #{realIdx + 1}
            </div>

            <div className="font-bold">
              +{points}
            </div>

          </div>
        );
      })}

    </div>
  );
};

export default ResultsComparison;