import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { ArrowRight, Info, Star, X } from "lucide-react";
import type { Pokemon } from "../../types";
import styles from "./PrizeModal.module.scss";

type PrizeModalProps = {
  pokemon: Pokemon;
  onContinue: () => void;
  isTutorial?: boolean;
};

function PrizeModal({
  pokemon,
  onContinue,
  isTutorial = false,
}: PrizeModalProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Block body scroll when modal is open
    document.body.style.overflow = "hidden";

    if (pokemon.cries?.latest) {
      audioRef.current = new Audio(pokemon.cries.latest);
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }

    return () => {
      // Restore body scroll when modal closes
      document.body.style.overflow = "";

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [pokemon]);

  const modalTree = (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className={styles.banner}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className={styles.bannerContent}>
          <span className={styles.bannerIcon}>🎉</span>
          <h3 className={styles.bannerTitle}>
            {isTutorial
              ? "Hai ricevuto il tuo primo Pokémon!"
              : "Hai vinto un nuovo Pokémon!"}
          </h3>
        </div>
      </motion.div>

      <motion.div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      >
        <motion.div
          className={`${styles.flipCard} ${pokemon.isLegendary ? styles.legendary : ""}`}
          initial={{ opacity: 0, y: 8, rotateY: 0 }}
          animate={{
            opacity: 1,
            y: 0,
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{
            opacity: { duration: 0.3, delay: 0.05 },
            y: { duration: 0.3, delay: 0.05 },
            rotateY: { duration: 0.6, ease: "easeInOut" },
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of card - Collection style */}
          <motion.div
            className={styles.cardFace + " " + styles.cardFront}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className={styles.imageContainer}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.cardId}>
                    #{pokemon.id.toString().padStart(3, "0")}
                  </span>

                  <h2 className={styles.cardName}>
                    {pokemon.name.charAt(0).toUpperCase() +
                      pokemon.name.slice(1)}
                  </h2>
                </div>
                <button
                  className={styles.infoButton}
                  onClick={() => setIsFlipped(!isFlipped)}
                  aria-label="Mostra dettagli"
                >
                  <Info size={20} />
                </button>
              </div>

              <div className={styles.pokemonImageWrapper}>
                {!isFlipped && pokemon.isLegendary && (
                  <div className={styles.legendaryBadge}>
                    <Star size={14} fill="currentColor" />
                    Leggendario
                  </div>
                )}

                <img
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  className={styles.pokemonImage}
                />
              </div>

              <div className={styles.types}>
                {pokemon.types.map((type) => (
                  <span key={type} className={styles.type}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Back of card - Details */}
          <motion.div
            className={styles.cardFace + " " + styles.cardBack}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.cardId}>
                  #{pokemon.id.toString().padStart(3, "0")}
                </span>

                <h2 className={styles.cardName}>
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </h2>
              </div>
              <button
                className={styles.infoButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
                aria-label="Nascondi dettagli"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.info}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Altezza:</span>
                  <span className={styles.value}>
                    {(pokemon.height / 10).toFixed(1)} m
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Peso:</span>
                  <span className={styles.value}>
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </span>
                </div>
              </div>

              <div className={styles.abilities}>
                <h3 className={styles.sectionTitle}>Abilità</h3>
                <div className={styles.abilityList}>
                  {pokemon.abilities.map((ability) => (
                    <span key={ability} className={styles.ability}>
                      {ability}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.stats}>
                <h3 className={styles.sectionTitle}>Statistiche</h3>
                {pokemon.stats.map((stat) => (
                  <div key={stat.name} className={styles.stat}>
                    <span className={styles.statName}>{stat.name}</span>
                    <div className={styles.statBar}>
                      <div
                        className={styles.statFill}
                        style={{ width: `${(stat.value / 255) * 100}%` }}
                      />
                    </div>
                    <span className={styles.statValue}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={onContinue}
        className={styles.continueButton}
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -1 }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {isTutorial ? "Vai alla collection 🚀" : "Continua"}
        <ArrowRight size={20} />
      </motion.button>
    </motion.div>
  );

  return createPortal(modalTree, document.body);
}

export default PrizeModal;
