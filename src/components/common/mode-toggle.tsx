import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const themes = [
  {
    key: "system",
    icon: Monitor,
    label: "System theme",
  },
  {
    key: "light",
    icon: Sun,
    label: "Light theme",
  },
  {
    key: "dark",
    icon: Moon,
    label: "Dark theme",
  },
];

const ModeToggle = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative flex h-8 rounded-lg bg-background p-1 ring-1 ring-border">
        {themes.map(({ key, icon: Icon }) => (
          <div className="relative h-6 w-6 rounded-lg" key={key}>
            <Icon className="relative m-auto h-4 w-4 text-primary" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex h-8 rounded-lg bg-background p-1 ring-1 ring-border">
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;
        return (
          <button
            aria-label={label}
            className="relative h-6 w-6 rounded-lg"
            key={key}
            onClick={() => setTheme(key as "light" | "dark" | "system")}
            type="button"
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-lg bg-primary"
                layoutId="activeTheme"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <Icon
              className={cn(
                "relative m-auto h-4 w-4",
                isActive ? "text-primary-foreground" : "text-primary"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export { ModeToggle };
