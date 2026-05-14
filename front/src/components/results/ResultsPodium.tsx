import { motion } from "framer-motion";
import { Artist } from "@/data/artists";

type Props = {
  realResults: Artist[];
  revealed: number;
};

const podiumColors = [
  "text-gold",
  "text-silver",
  "text-bronze",
];

const podiumBg = [
  "bg-gold/10 border-gold/30",
  "bg-silver/10 border-silver/30",
  "bg-bronze/10 border-bronze/30",
];

const heights = [
  "h-40",
  "h-48",
  "h-32",
];

const ResultsPodium = ({
  realResults,
  revealed,
}: Props) => {

  return (

    <div className="
      flex items-end justify-center
      gap-3 mb-8 h-48
    ">

      {[1, 0, 2].map((i) => {

        const artist = realResults[i];

        if (!artist || revealed <= i) {
          return (
            <div
              key={i}
              className="flex-1"
            />
          );
        }

        return (

          <motion.div
            key={artist.id}
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              type: "spring",
              bounce: 0.4,
              delay: i * 0.2,
            }}
            className={`
              flex-1
              ${heights[i]}
              rounded-t-xl
              border
              flex flex-col
              items-center
              justify-end
              pb-3
              ${podiumBg[i]}
            `}
          >

            <span className="text-3xl">
              {artist.flag}
            </span>

            <span className={`
              font-bold
              ${podiumColors[i]}
            `}>
              #{i + 1}
            </span>

            <span className="
              text-xs
              text-center
              truncate
              w-full
            ">
              {artist.artist}
            </span>

          </motion.div>
        );
      })}
    </div>
  );
};

export default ResultsPodium;