import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { useStore } from "../../store/useStore";
import PokemonCard from "../PokemonCard/PokemonCard";
import styles from "./Collection.module.scss";
import { Link } from "react-router-dom";

function Collection() {
  const { collection, removePokemonFromCollection, progress } = useStore();
  const isTutorialMode =
    collection.length === 1 && progress.challengesCompleted === 0;
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(
    null,
  );
  const [filter, setFilter] = useState<"all" | "legendary">("all");

  const filteredCollection =
    filter === "legendary"
      ? collection.filter((p) => p.isLegendary)
      : collection;

  const selectedPokemon = collection.find((p) => p.id === selectedPokemonId);

  function handleDelete(id: number) {
    if (
      confirm("Sei sicuro di voler rimuovere questo Pokémon dalla collezione?")
    ) {
      removePokemonFromCollection(id);
      if (selectedPokemonId === id) {
        setSelectedPokemonId(null);
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>La Mia Collezione</h1>
        {isTutorialMode && (
          <div className={styles.tutorialIntro}>
            <p className={styles.introText}>
              🎉 Congratulazioni! Hai ottenuto il tuo primo Pokémon!
            </p>
            <p className={styles.introText}>
              Questa è la tua collezione personale. Ogni volta che completi una
              sfida, potrai catturare un nuovo Pokémon!
            </p>
            <Link to="/start" className={styles.startButton}>
              Inizia l'avventura! 🚀
            </Link>
          </div>
        )}
        <div className={styles.stats}>
          <span className={styles.stat}>
            Totale: <strong>{collection.length}</strong>
          </span>
          <span className={styles.stat}>
            Leggendari:{" "}
            <strong>{collection.filter((p) => p.isLegendary).length}</strong>
          </span>
        </div>
      </div>

      <div className={styles.filters}>
        <button
          onClick={() => setFilter("all")}
          className={`${styles.filterButton} ${filter === "all" ? styles.active : ""}`}
        >
          Tutti
        </button>
        <button
          onClick={() => setFilter("legendary")}
          className={`${styles.filterButton} ${filter === "legendary" ? styles.active : ""}`}
        >
          ⭐ Leggendari
        </button>
      </div>

      {filteredCollection.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <h2 className={styles.emptyTitle}>Nessun Pokémon nella collezione</h2>
          <p className={styles.emptyText}>
            Completa le sfide per ottenere nuovi Pokémon!
          </p>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.grid}>
            {filteredCollection.map((pokemon) => (
              <div
                key={pokemon.id}
                onClick={() => setSelectedPokemonId(selectedPokemonId === pokemon.id ? null : pokemon.id)}
                className={`${styles.gridItem} ${selectedPokemonId === pokemon.id ? styles.selected : ""}`}
              >
                <img
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  className={styles.gridImage}
                />
                <div className={styles.gridInfo}>
                  <span className={styles.gridName}>
                    {pokemon.name.charAt(0).toUpperCase() +
                      pokemon.name.slice(1)}
                  </span>
                  <span className={styles.gridId}>
                    #{pokemon.id.toString().padStart(3, "0")}
                  </span>
                </div>
                {pokemon.isLegendary && (
                  <div className={styles.gridBadge}>⭐</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedPokemon && (
          <>
            {/* Backdrop */}
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedPokemonId(null)}
            />
            
            {/* Drawer */}
            <motion.div
              className={styles.drawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className={styles.drawerHeader}>
                <h2 className={styles.drawerTitle}>Dettagli</h2>
                <button
                  onClick={() => setSelectedPokemonId(null)}
                  className={styles.closeButton}
                  aria-label="Chiudi"
                >
                  <X size={24} />
                </button>
              </div>
              <div className={styles.drawerContent}>
                <PokemonCard pokemon={selectedPokemon} />
                <button
                  onClick={() => handleDelete(selectedPokemon.id)}
                  className={styles.deleteButton}
                >
                  <Trash2 size={16} />
                  Rimuovi
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Collection;
