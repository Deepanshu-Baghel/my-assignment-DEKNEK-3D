import { useTheme } from "../hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button className="btn btn-secondary theme-toggle" type="button" onClick={toggleTheme}>
      {isDark ? "Light Theme" : "Dark Theme"}
    </button>
  );
};

export default ThemeToggle;
