import { useMemo } from "react";

import { Artist } from "@/data/artists";

type Props = {
  pseudo: string;
  ranking: Artist[];
  realResults: Artist[];
};

const ResultsUserCard = ({
  pseudo,
  ranking,
  realResults,
}: Props) => {

    const score = useMemo(() => {
    return ranking.reduce((acc, artist, userIdx) => {
        const realIdx = realResults.findIndex(a => a.id === artist.id);

        // ❌ artiste non trouvé
        if (realIdx === -1) return acc;

        // 📏 score basé sur la distance
        const diff = Math.abs(realIdx - userIdx);
        let points = Math.max(0, 100 - diff * 5);

        // 🏆 BONUS TOP 3
        if (realIdx <= 2) {
        points += 50;
        }

        // ⭐ BONUS TOP 10
        else if (realIdx <= 9) {
        points += 20;
        }

        return acc + points;
    }, 0);
    }, [ranking, realResults]);

  const maxScore =
    realResults.length * 100;

  const userRank = Math.max(
    1,
    Math.ceil((1 - score / maxScore) * 10)
  );

  return (

    <div className="
      mb-6
      p-4
      rounded-xl
      border
      bg-card/60
      border-primary/30
    ">

      <p className="
        text-sm
        text-muted-foreground
      ">
        Joueur
      </p>

      <p className="
        text-xl
        font-bold
        font-display
      ">
        {pseudo}
      </p>

      <div className="
        flex justify-between
        mt-3
      ">

        <div>

          <p className="
            text-sm
            text-muted-foreground
          ">
            Score
          </p>

          <p className="
            text-2xl
            font-bold
            text-primary
          ">
            {score} / {maxScore}
          </p>

        </div>

        <div className="text-right">

          <p className="
            text-sm
            text-muted-foreground
          ">
            Rank
          </p>

          <p className="
            text-2xl
            font-bold
          ">
            #{userRank}
          </p>

        </div>
      </div>
    </div>
  );
};

export default ResultsUserCard;