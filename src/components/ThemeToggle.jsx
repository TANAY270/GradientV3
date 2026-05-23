import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useTheme();

  if (compact) {
    return (
      <button
        type="button"
        className="btn btn--ghost btn--icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    );
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      <button
        type="button"
        className={`theme-toggle__btn${theme === 'light' ? ' theme-toggle__btn--active' : ''}`}
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
      >
        <Sun size={14} />
        Light
      </button>
      <button
        type="button"
        className={`theme-toggle__btn${theme === 'dark' ? ' theme-toggle__btn--active' : ''}`}
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
      >
        <Moon size={14} />
        Dark
      </button>
    </div>
  );
}
