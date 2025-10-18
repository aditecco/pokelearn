import { useState } from "react";
import { Play, Star } from "lucide-react";
import type { Pokemon } from "../../types";
import { useStore } from "../../store/useStore";
import styles from "./PokemonCard.module.scss";

type PokemonCardProps = {
  pokemon: Pokemon;
  onSave?: () => void;
  showSaveButton?: boolean;
};

function PokemonCard({
  pokemon,
  onSave,
  showSaveButton = false,
}: PokemonCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const settings = useStore((state) => state.settings);

  function playSound() {
    if (!settings.soundEnabled || !pokemon.cries?.latest) return;

    const audio = new Audio(pokemon.cries.latest);
    setIsPlaying(true);
    audio.play();
    audio.onended = () => setIsPlaying(false);
  }

  return (
    <div
      className={`${styles.card} ${pokemon.isLegendary ? styles.legendary : ""}`}
    >
      <div className={styles.header}>
        <h2 className={styles.name}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </h2>
        <span className={styles.id}>
          #{pokemon.id.toString().padStart(3, "0")}
        </span>
      </div>

      <div className={styles.imageContainer}>
        <img
          src={pokemon.imageUrl}
          alt={pokemon.name}
          className={styles.image}
        />
        {pokemon.isLegendary && (
          <div className={styles.legendaryBadge}>
            <Star size={16} fill="currentColor" />
            Leggendario
          </div>
        )}
      </div>

      <div className={styles.types}>
        {pokemon.types.map((type) => (
          <span key={type} className={`${styles.type} ${styles[type]}`}>
            {type}
          </span>
        ))}
      </div>

      <div className={styles.info}>
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

      <div className={styles.actions}>
        {pokemon.cries?.latest && (
          <button
            onClick={playSound}
            disabled={isPlaying || !settings.soundEnabled}
            className={styles.soundButton}
          >
            <Play />
            {isPlaying ? "In riproduzione..." : "Ascolta verso"}
          </button>
        )}
        {showSaveButton && onSave && (
          <button onClick={onSave} className={styles.saveButton}>
            💾 Salva nella collezione
          </button>
        )}
      </div>
    </div>
  );
}

export default PokemonCard;
