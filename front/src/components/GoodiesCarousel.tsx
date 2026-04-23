import { motion } from "framer-motion";

// const goodies = [
//   { emoji: "👕", label: "T-shirt Eurovision", bg: "from-primary/20 to-secondary/20" },
//   { emoji: "☕", label: "Mug personnalisé", bg: "from-accent/20 to-primary/20" },
//   { emoji: "🔥", label: "Surprise", bg: "from-secondary/20 to-accent/20" },
//   { emoji: "🎧", label: "Écouteurs LED", bg: "from-primary/20 to-accent/20" },
//   { emoji: "🧢", label: "Casquette Eurovision", bg: "from-accent/20 to-secondary/20" },
// ];
const goodies = [
  { image: "/Eurovision/goodies/caca.jpeg", label: "Caca personnalisé", bg: "from-accent/20 to-primary/20" },
  { image: "/Eurovision/goodies/chaussettes.jpeg", label: "Chaussettes personnalisées", bg: "from-accent/20 to-primary/20" },
  { image: "/Eurovision/goodies/fuck.jpeg", label: "Fuck personnalisé", bg: "from-accent/20 to-primary/20" },
  { image: "/Eurovision/goodies/shark.jpeg", label: "Shark personnalisé", bg: "from-accent/20 to-primary/20" },
];

// Duplicate for seamless loop
const items = [...goodies, ...goodies];

const GoodiesCarousel = () => {
  return (
    <div className="overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />

      <motion.div
        className="flex gap-4"
        animate={{ x: [0, -(goodies.length * 180)] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {items.map((g, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.08, y: -4 }}
            className={`flex-shrink-0 w-40 h-28 rounded-xl border border-border/50 bg-gradient-to-br ${g.bg} backdrop-blur-sm flex flex-col items-center justify-center gap-2 cursor-pointer transition-shadow hover:box-glow`}
          >
            {/* <span className="text-3xl">{g.emoji}</span> */}
            <img
              src={g.image}
              alt={g.label}
              className="w-14 h-14 object-contain"
            />
            <span className="text-xs font-medium text-foreground text-center px-2">{g.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GoodiesCarousel;
