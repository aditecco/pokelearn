import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Calculator, Languages, Filter } from "lucide-react";
import { useStore } from "../../store/useStore";
import type { ChallengeSet, Difficulty, Grade, Subject } from "../../types";
import styles from "./ChallengeSetSelection.module.scss";

function ChallengeSetSelection() {
  const navigate = useNavigate();
  const {
    settings,
    progress,
    challengeSets: allSets,
    startChallengePath,
    updateSettings,
  } = useStore();
  const [selectedGrade, setSelectedGrade] = useState<Grade>(settings.grade);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    settings.difficulty,
  );
  const [showOnlyUncompleted, setShowOnlyUncompleted] = useState(false);

  const filteredByGrade = allSets.filter(
    (set) =>
      set.grade === selectedGrade && set.difficulty === selectedDifficulty,
  );

  const challengeSets = showOnlyUncompleted
    ? filteredByGrade.filter(
        (set) => !progress.completedChallengeSets?.includes(set.id),
      )
    : filteredByGrade;

  function handleDifficultyChange(difficulty: Difficulty) {
    setSelectedDifficulty(difficulty);
    updateSettings({ difficulty });
  }

  function handleSelectSet(set: ChallengeSet) {
    startChallengePath(set);
    navigate(`/challenge/${set.id}/0`);
  }

  function SubjectIcon({ subject }: { subject: Subject }) {
    const size = 22;
    switch (subject) {
      case "Italiano":
        return <BookOpen size={size} />;
      case "Matematica":
        return <Calculator size={size} />;
      case "Inglese":
        return <Languages size={size} />;
      default:
        return null;
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Ciao, {progress.userName || "Allenatore"}! 👋
        </h1>
        <p className={styles.subtitle}>
          Scegli un set di sfide per iniziare la tua avventura
        </p>
      </div>

      <div className={styles.progressSection}>
        <h2 className={styles.progressTitle}>Progress</h2>
        <div className={styles.progressGrid}>
          <div className={styles.progressCard}>
            <span className={styles.progressLabel}>Punti Totali</span>
            <span className={styles.progressValue}>{progress.totalPoints}</span>
          </div>
          <div className={styles.progressCard}>
            <span className={styles.progressLabel}>Sfide Completate</span>
            <span className={styles.progressValue}>
              {progress.challengesCompleted}
            </span>
          </div>
          <div className={styles.progressCard}>
            <span className={styles.progressLabel}>Sfide Fallite</span>
            <span className={styles.progressValue}>
              {progress.challengesFailed}
            </span>
          </div>
          <div className={styles.progressCard}>
            <span className={styles.progressLabel}>Pokémon Raccolti</span>
            <span className={styles.progressValue}>
              {progress.pokemonCollected}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.gradeSelector}>
        <label className={styles.gradeLabel}>Seleziona Classe:</label>
        <div className={styles.gradeButtons}>
          {([1, 2, 3, 4, 5] as Grade[]).map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`${styles.gradeButton} ${selectedGrade === grade ? styles.active : ""}`}
            >
              {grade}ª
            </button>
          ))}
        </div>
      </div>

      <div className={styles.difficultySelector}>
        <label className={styles.difficultyLabel}>Seleziona Difficoltà:</label>
        <div className={styles.difficultyButtons}>
          {(["Facile", "Medio", "Difficile"] as Difficulty[]).map(
            (difficulty) => (
              <button
                key={difficulty}
                onClick={() => handleDifficultyChange(difficulty)}
                className={`${styles.difficultyButton} ${selectedDifficulty === difficulty ? styles.active : ""}`}
              >
                {difficulty}
              </button>
            ),
          )}
        </div>
      </div>

      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>
          <span className={styles.filterText}>
            <Filter size={18} />
            Mostra solo non completati
          </span>
          <input
            type="checkbox"
            checked={showOnlyUncompleted}
            onChange={(e) => setShowOnlyUncompleted(e.target.checked)}
            className={styles.filterCheckbox}
          />
          <span className={styles.filterSwitch}></span>
        </label>
      </div>

      <div className={styles.setsGrid}>
        {challengeSets.length === 0 ? (
          <div className={styles.empty}>
            <p>Nessun set disponibile per questa classe</p>
          </div>
        ) : (
          challengeSets.map((set, idx) => {
            const isCompleted =
              progress.completedChallengeSets?.includes(set.id) || false;
            return (
              <motion.div
                key={set.id}
                className={`${styles.setCard} ${isCompleted ? styles.completed : ""}`}
                style={{ borderColor: set.color }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.08,
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => handleSelectSet(set)}
              >
                <div className={styles.cardTopAccent} />
                {isCompleted && (
                  <div className={styles.completedBadge}>✓ Completato</div>
                )}
                <div className={styles.cardIconWrap}>
                  <SubjectIcon subject={set.subject} />
                </div>
                <h3 className={styles.cardTitle}>{set.name}</h3>
                <p className={styles.cardDescription}>{set.description}</p>
                <div className={styles.cardInfo}>
                  <div className={styles.cardBadge}>
                    <span>{set.subject}</span>
                    <span className={styles.badgeSeparator}></span>
                    <span>{set.difficulty}</span>
                  </div>
                  <span className={styles.cardCount}>
                    {set.challengeIds.length} sfide
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ChallengeSetSelection;
