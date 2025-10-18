import Tutorial from "../components/Tutorial/Tutorial";
import styles from "./WelcomePage.module.scss";

function WelcomePage() {
  return (
    <div className={styles.welcomePage}>
      <main className={styles.main}>
        <Tutorial />
      </main>
    </div>
  );
}

export default WelcomePage;
