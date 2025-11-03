import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheckBig, CircleX, Gift, Star } from "lucide-react";
import { useStore } from "../../store/useStore";
import { getRandomPokemon } from "../../services/pokeapi";
import type { Pokemon } from "../../types";
import PrizeModal from "../PrizeModal/PrizeModal";
import styles from "./Challenge.module.scss";

type ChallengeFormData = {
  answer: string;
};

function Challenge() {
  const { setId, index } = useParams<{ setId: string; index: string }>();
  const navigate = useNavigate();
  const {
    currentChallenge,
    currentAttempt,
    progress,
    selectedChallengeSet,
    currentChallengeIndex,
    submitAnswer,
    savePokemonToCollection,
    advanceToNextChallenge,
    clearChallengeSet,
    loadChallengeAt,
  } = useStore();

  // Sync state with route params
  useEffect(() => {
    if (!setId || index == null) return;
    const idx = Number(index);
    if (Number.isNaN(idx)) {
      navigate("/start", { replace: true });
      return;
    }
    // If store is empty or out of sync, load the requested challenge
    if (
      !selectedChallengeSet ||
      selectedChallengeSet.id !== setId ||
      currentChallengeIndex !== idx
    ) {
      loadChallengeAt(setId, idx);
    }
  }, [
    setId,
    index,
    selectedChallengeSet,
    currentChallengeIndex,
    loadChallengeAt,
    navigate,
  ]);

  const [isLoadingPokemon, setIsLoadingPokemon] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [claimedPokemon, setClaimedPokemon] = useState<Pokemon | null>(null);

  const { register, handleSubmit, reset } = useForm<ChallengeFormData>();

  useEffect(() => {
    if (currentChallenge) {
      reset();
      setSelectedOption("");
    }
  }, [currentChallenge, reset]);

  async function onSubmit(data: ChallengeFormData) {
    if (!currentChallenge || !currentAttempt) return;

    let answer = data.answer;
    if (currentChallenge.type === "multiple-choice") {
      answer = selectedOption;
    } else if (currentChallenge.type === "true-false") {
      answer = selectedOption;
    }

    if (!answer) {
      toast.error("Seleziona una risposta!");
      return;
    }

    const isCorrect = submitAnswer(answer);

    if (isCorrect) {
      toast.success(`Corretto! +${currentChallenge.points} punti! 🎉`);
    } else {
      const attemptsLeft =
        currentAttempt.maxAttempts - (currentAttempt.attempts + 1);
      if (attemptsLeft > 0) {
        toast.error(`Sbagliato! Ti rimangono ${attemptsLeft} tentativi.`);
      } else {
        toast.error("Sfida fallita! 😢");
      }
    }
  }

  async function handleClaimPokemon(legendary = false) {
    setIsLoadingPokemon(true);
    try {
      const pokemon = await getRandomPokemon(legendary);
      setClaimedPokemon(pokemon);
      setShowPrizeModal(true);
    } catch (error) {
      toast.error("Errore nel recuperare il Pokémon");
    } finally {
      setIsLoadingPokemon(false);
    }
  }

  async function handleContinueAfterPrize() {
    // Save Pokémon to collection from modal
    if (claimedPokemon) {
      await savePokemonToCollection(claimedPokemon);
      toast.success("Hai ottenuto un nuovo Pokémon! 🎊");
    }

    setShowPrizeModal(false);
    setClaimedPokemon(null);

    // Advance to next challenge or return to start
    if (!selectedChallengeSet) return;
    const nextIndex = currentChallengeIndex + 1;
    const hasNext = await advanceToNextChallenge();
    if (hasNext) {
      navigate(`/challenge/${selectedChallengeSet.id}/${nextIndex}`, {
        replace: true,
      });
    } else {
      clearChallengeSet();
      navigate("/start", { replace: true });
    }
  }

  if (!currentChallenge || !selectedChallengeSet) {
    return null;
  }

  const isCompleted = currentAttempt?.completed || false;
  const isSuccess = currentAttempt?.success || false;

  // Calculate legendary progress
  const LEGENDARY_THRESHOLD = 100;
  const totalPoints = progress.totalPoints;
  const currentMilestone =
    Math.floor(totalPoints / LEGENDARY_THRESHOLD) * LEGENDARY_THRESHOLD;
  const pointsTowardsLegendary = totalPoints - currentMilestone;
  const legendaryProgress =
    (pointsTowardsLegendary / LEGENDARY_THRESHOLD) * 100;

  return (
    <div className={styles.container}>
      {/* Steps Progress - separate compact container */}
      <motion.div
        className={styles.stepsWidget}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className={styles.challengeProgress}>
          <span className={styles.challengeProgressLabel}>
            Sfida{" "}
            <span>
              {currentChallengeIndex + 1}/
              {selectedChallengeSet.challengeIds.length}
            </span>
          </span>

          <div className={styles.separator}></div>

          <div className={styles.challengeProgressBarContainer}>
            <div
              className={styles.challengeProgressBarFill}
              style={{
                width: `${((currentChallengeIndex + 1) / selectedChallengeSet.challengeIds.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        className={styles.progressWidget}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.progressRow}>
          <div className={styles.pointsSection}>
            <motion.span
              key={totalPoints}
              className={styles.progressPoints}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className={styles.progressLabel}>PUNTI</span>

              {totalPoints}
            </motion.span>
          </div>
          <div className={styles.separator}></div>
          <div className={styles.legendarySection}>
            <div className={styles.legendaryHeader}>
              <span className={styles.progressLabel}>Prossimo Leggendario</span>
              <span className={styles.legendaryCount}>
                {pointsTowardsLegendary}/{LEGENDARY_THRESHOLD}
              </span>
            </div>
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${legendaryProgress}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className={styles.challenge}
        key={currentChallenge.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.challengeHeader}>
          <div className={styles.challengeInfo}>
            <div className={styles.cardBadge}>
              <span>{currentChallenge.subject}</span>
              <span className={styles.badgeSeparator}></span>
              <span>{currentChallenge.difficulty}</span>
            </div>
          </div>

          <div className={styles.attemptsIndicator}>
            <span className={styles.attemptsLabel}>Tentativi:</span>
            <div className={styles.dotsContainer}>
              <div
                className={`${styles.dot} ${(currentAttempt?.attempts || 0) >= 1 ? styles.active : ""}`}
              />
              <div
                className={`${styles.dot} ${(currentAttempt?.attempts || 0) >= 2 ? styles.active : ""}`}
              />
              <div
                className={`${styles.dot} ${(currentAttempt?.attempts || 0) >= 3 ? styles.active : ""}`}
              />
            </div>
          </div>
        </div>

        <div className={styles.questionBox}>
          <h3 className={styles.question}>{currentChallenge.question}</h3>
        </div>

        {!isCompleted && (
          <div className={styles.form}>
            {currentChallenge.type === "multiple-choice" && (
              <div className={styles.options}>
                {currentChallenge.options?.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedOption(option)}
                    className={`${styles.option} ${selectedOption === option ? styles.selected : ""}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentChallenge.type === "true-false" && (
              <div className={styles.options}>
                <button
                  type="button"
                  onClick={() => setSelectedOption("true")}
                  className={`${styles.option} ${selectedOption === "true" ? styles.selected : ""}`}
                >
                  Vero
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOption("false")}
                  className={`${styles.option} ${selectedOption === "false" ? styles.selected : ""}`}
                >
                  Falso
                </button>
              </div>
            )}

            {currentChallenge.type === "fill-blank" && (
              <input
                {...register("answer")}
                type="text"
                placeholder="Scrivi la tua risposta..."
                className={styles.input}
              />
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          {isCompleted && (
            <div className={styles.result}>
              {isSuccess ? (
                <>
                  <motion.div
                    className={styles.successMessage}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className={styles.iconWrapper}>
                      <CircleCheckBig
                        size={24}
                        className={styles.successIcon}
                      />
                    </div>
                    <h4>Complimenti!</h4>
                    <p>Hai guadagnato {currentChallenge.points} punti!</p>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    className={styles.failureMessage}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className={styles.iconWrapper}>
                      <CircleX size={24} className={styles.failureIcon} />
                    </div>
                    <h3>Risposta Errata</h3>
                    <p>
                      La risposta corretta era: {currentChallenge.correctAnswer}
                    </p>
                  </motion.div>
                </>
              )}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {!isCompleted && (
        <motion.button
          onClick={handleSubmit(onSubmit)}
          className={styles.submitButton}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.98 }}
          whileHover={{ y: -1 }}
        >
          Invia Risposta
        </motion.button>
      )}

      {isCompleted && !isSuccess ? (
        <button
          onClick={async () => {
            if (!selectedChallengeSet) return;
            const nextIndex = currentChallengeIndex + 1;
            const hasNext = await advanceToNextChallenge();
            if (hasNext) {
              navigate(`/challenge/${selectedChallengeSet.id}/${nextIndex}`, {
                replace: true,
              });
            } else {
              clearChallengeSet();
              navigate("/start", { replace: true });
            }
          }}
          className={styles.retryButton}
        >
          {currentChallengeIndex < selectedChallengeSet.challengeIds.length - 1
            ? "Prossima Sfida →"
            : "Torna all'inizio"}
        </button>
      ) : null}

      {isCompleted && isSuccess ? (
        <div className={styles.rewardButtons}>
          {progress.legendariesUnlocked ? (
            <button
              onClick={() => handleClaimPokemon(true)}
              disabled={isLoadingPokemon || showPrizeModal}
              className={`${styles.claimButton} ${styles.legendary}`}
            >
              {isLoadingPokemon ? (
                "Caricamento..."
              ) : (
                <>
                  <Star /> Richiedi Pokémon leggendario
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => handleClaimPokemon(false)}
              disabled={isLoadingPokemon || showPrizeModal}
              className={styles.claimButton}
            >
              {isLoadingPokemon ? (
                "Caricamento..."
              ) : (
                <>
                  <Gift /> Richiedi Pokémon
                </>
              )}
            </button>
          )}
        </div>
      ) : null}

      {showPrizeModal && claimedPokemon && (
        <PrizeModal
          pokemon={claimedPokemon}
          onContinue={handleContinueAfterPrize}
          isTutorial={false}
        />
      )}
    </div>
  );
}

export default Challenge;
