import type { ReactElement } from "react";
import { useEffect } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Zap,
  Gamepad2,
  BookOpen,
  Settings as SettingsIcon,
} from "lucide-react";
import { useStore } from "./store/useStore";
import WelcomePage from "./pages/WelcomePage";
import StartPage from "./pages/StartPage";
import Challenge from "./components/Challenge/Challenge";
import Collection from "./components/Collection/Collection";
import Settings from "./components/Settings/Settings";
import styles from "./App.module.scss";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";

function AppContent() {
  const location = useLocation();
  const { initialize, initialized, progress } = useStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Caricamento...</p>
      </div>
    );
  }

  // Route-level guard will handle onboarding redirects; no global redirect here

  function RequireOnboarded({ children }: { children: ReactElement }) {
    if (!initialized)
      return (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Caricamento...</p>
        </div>
      );
    if (!progress.tutorialCompleted) {
      return <Navigate to="/welcome" replace />;
    }
    return children;
  }

  const isActive = (path: string) => {
    if (path === "/start") {
      return (
        location.pathname === "/start" ||
        location.pathname.startsWith("/challenge/")
      );
    }
    return location.pathname === path;
  };

  return (
    <div className={styles.app}>
      <Toaster position="top-center" />

      <header className={styles.header}>
        <motion.div
          className={styles.headerContent}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
        >
          <Link to="/" className={styles.logoLink}>
            <h1 className={styles.logo}>
              <span className={styles.logoIcon}>
                <Zap size={24} />
              </span>
              PokeLearn
            </h1>
          </Link>
          <nav className={styles.nav}>
            <Link
              to="/start"
              className={`${styles.navButton} ${isActive("/start") ? styles.active : ""}`}
            >
              <Gamepad2 size={18} />
              Sfide
            </Link>
            <Link
              to="/collection"
              className={`${styles.navButton} ${isActive("/collection") ? styles.active : ""}`}
            >
              <BookOpen size={18} />
              Collezione
            </Link>
            <Link
              to="/settings"
              className={`${styles.navButton} ${isActive("/settings") ? styles.active : ""}`}
            >
              <SettingsIcon size={18} />
              Settings
            </Link>
          </nav>
        </motion.div>
      </header>

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/start" replace />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route
            path="/start"
            element={
              <RequireOnboarded>
                <StartPage />
              </RequireOnboarded>
            }
          />
          <Route
            path="/challenge/:setId/:index"
            element={
              <RequireOnboarded>
                <Challenge />
              </RequireOnboarded>
            }
          />
          <Route
            path="/collection"
            element={
              <RequireOnboarded>
                <Collection />
              </RequireOnboarded>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireOnboarded>
                <Settings />
              </RequireOnboarded>
            }
          />
          <Route path="*" element={<Navigate to="/start" replace />} />
        </Routes>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 PokeLearn - Impara divertendoti con i Pokémon!</p>
        <ThemeToggle />
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
