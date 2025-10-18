import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import styles from "./ThemeToggle.module.scss";

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(
    (document.documentElement.getAttribute("data-theme") as "light" | "dark") ||
      "light",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      className={styles.toggle}
      aria-label="Toggle theme"
      title={theme === "dark" ? "Passa a tema chiaro" : "Passa a tema scuro"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      <span className={styles.label}>
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}

export default ThemeToggle;
