import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useStore } from "../../store/useStore";
import { getPokemonById } from "../../services/pokeapi";
import PrizeModal from "../PrizeModal/PrizeModal";
import styles from "./Tutorial.module.scss";

type TutorialFormData = {
  userName: string;
};

function Tutorial() {
  const navigate = useNavigate();
  const {
    setUserName,
    completeTutorial,
    lastRewardPokemon,
    clearChallengeSet,
  } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TutorialFormData>();

  async function onSubmit(data: TutorialFormData) {
    if (!data.userName.trim()) {
      toast.error("Per favore, inserisci il tuo nome!");
      return;
    }

    setIsLoading(true);
    try {
      await setUserName(data.userName.trim());
      const pikachu = await getPokemonById(25);
      await completeTutorial(pikachu);
      setShowPrizeModal(true);
      toast.success(`Benvenuto, ${data.userName}! 🎉`);
    } catch (error) {
      toast.error("Errore durante il caricamento. Riprova!");
    } finally {
      setIsLoading(false);
    }
  }

  function handleContinue() {
    // Clear any selected challenge set
    clearChallengeSet();
    // Replace history to prevent going back to tutorial
    navigate("/collection", { replace: true });
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.tutorial}>
          <div className={styles.header}>
            <h1 className={styles.title}>Benvenuto in PokeLearn! ⚡</h1>
            <p className={styles.subtitle}>
              Impara divertendoti e colleziona Pokémon fantastici!
            </p>
          </div>

          <div className={styles.content}>
            <div className={styles.infoBox}>
              <h3 className={styles.infoTitle}>Come funziona?</h3>
              <ul className={styles.infoList}>
                <li>📚 Scegli una materia e inizia le sfide</li>
                <li>🎯 Rispondi correttamente per guadagnare punti</li>
                <li>⚡ Ottieni Pokémon dopo ogni sfida completata</li>
                <li>🏆 Raggiungi 100 punti per sbloccare i Leggendari</li>
              </ul>
            </div>

            <div className={styles.formBox}>
              <h3 className={styles.formTitle}>Prima di iniziare...</h3>
              <p className={styles.formDescription}>
                Come ti chiami? Inserisci il tuo nome per ricevere il tuo primo
                Pokémon!
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="userName" className={styles.label}>
                    Il tuo nome
                  </label>
                  <input
                    id="userName"
                    type="text"
                    {...register("userName", {
                      required: "Il nome è obbligatorio",
                      minLength: {
                        value: 2,
                        message: "Il nome deve avere almeno 2 caratteri",
                      },
                    })}
                    placeholder="Scrivi qui il tuo nome..."
                    className={styles.input}
                    disabled={isLoading}
                  />
                  {errors.userName && (
                    <span className={styles.error}>
                      {errors.userName.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={styles.submitButton}
                >
                  {isLoading ? "Caricamento..." : "🎁 Ricevi il tuo Pokémon!"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showPrizeModal && lastRewardPokemon && (
        <PrizeModal
          pokemon={lastRewardPokemon}
          onContinue={handleContinue}
          isTutorial={true}
        />
      )}
    </>
  );
}

export default Tutorial;
