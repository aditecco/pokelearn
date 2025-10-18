import toast from "react-hot-toast";
import { useStore } from "../../store/useStore";
import styles from "./Settings.module.scss";

function Settings() {
  const { settings, updateSettings, resetProgress } = useStore();

  function handleToggleSound() {
    updateSettings({ soundEnabled: !settings.soundEnabled });
    toast.success(
      settings.soundEnabled ? "Audio disattivato" : "Audio attivato",
    );
  }

  function handleResetProgress() {
    if (
      confirm(
        "Sei sicuro di voler resettare tutti i progressi? Questa azione non può essere annullata.",
      )
    ) {
      resetProgress();
      toast.success("Progressi resettati!");
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Audio</h2>
        <div className={styles.setting}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Sound Effects</span>
            <span className={styles.settingDescription}>
              Abilita o disabilita i suoni dei Pokémon
            </span>
          </div>
          <button
            onClick={handleToggleSound}
            className={`${styles.toggle} ${settings.soundEnabled ? styles.active : ""}`}
          >
            <div className={styles.toggleSlider} />
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Data Management</h2>
        <button onClick={handleResetProgress} className={styles.dangerButton}>
          🔄 Reset Progress
        </button>
        <p className={styles.warning}>
          Attenzione: Questa azione eliminerà tutti i tuoi progressi e non può
          essere annullata.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>About</h2>
        <div className={styles.about}>
          <p>
            <strong>PokeLearn</strong> è un'app educativa per studenti di
            seconda elementare.
          </p>
          <p>Completa le sfide, guadagna punti e colleziona Pokémon!</p>
          <p className={styles.version}>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
