import { motion } from "framer-motion";
import { Artist } from "@/data/artists";

type Props = {
  realResults: Artist[];
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const ResultsRanking = ({ realResults }: Props) => {
  return (
    <motion.div
      className="space-y-2 mb-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {realResults.map((artist, i) => (
        <motion.div
          key={artist.id}
          variants={item}
          className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/60 border"
        >
          <span className="w-6 text-center font-bold">
            {i + 1}
          </span>
          <span>{artist.flag}</span>
          <span className="flex-1 truncate">
            {artist.artist}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ResultsRanking;