import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import useTheme from "@/theme/store";

function ThemeToggle() {
  const theme = useTheme((state) => state.theme);
  const toggleTheme = useTheme((state) => state.toggleTheme);

  const label =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="cursor-pointer"
    >
      {/* sun is shown in dark mode (click -> light), moon in light mode (click -> dark) */}
      <Sun className="hidden dark:block" />
      <Moon className="block dark:hidden" />
    </Button>
  );
}

export default ThemeToggle;
