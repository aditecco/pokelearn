import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Download, Upload } from "lucide-react";
import { useStore } from "../../store/useStore";
import { exportAllData, importData } from "../../services/db";
import styles from "./Settings.module.scss";

function Settings() {
  const { settings, updateSettings, resetProgress, initialize } = useStore();
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  async function handleExport() {
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pokelearn-backup-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Collezione esportata con successo!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Errore durante l'esportazione");
    }
  }

  async function handleImport(file: File) {
    try {
      setIsImporting(true);
      const text = await file.text();
      const data = JSON.parse(text);

      await importData(data);

      await initialize();

      toast.success("Collezione importata con successo!");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(
        error instanceof Error ? error.message : "File non valido o corrotto",
      );
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error("Seleziona un file JSON valido");
      return;
    }

    const shouldReplace = confirm(
      "Vuoi sostituire la collezione attuale?\n\n" +
        "Questa azione eliminerà tutti i Pokémon e i progressi attuali.\n\n" +
        "OK = Sostituisci\nAnnulla = Annulla operazione",
    );

    if (shouldReplace) {
      handleImport(file);
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
        <h2 className={styles.sectionTitle}>Backup & Restore</h2>
        <div className={styles.backupButtons}>
          <button onClick={handleExport} className={styles.primaryButton}>
            <Download size={20} />
            Esporta Collezione
          </button>

          <label className={styles.importButton}>
            <Upload size={20} />
            Importa Collezione
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={isImporting}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <p className={styles.info}>
          Esporta la tua collezione per fare un backup o trasferirla su un altro
          dispositivo. L'importazione sostituirà tutti i dati attuali.
        </p>
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
