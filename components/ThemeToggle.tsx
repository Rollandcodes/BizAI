'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1 dark:bg-gray-800">
      <button
        onClick={() => setTheme('light')}
        title="Light mode"
        aria-label="Light mode"
        className={`rounded-full p-1.5 text-sm transition-all ${
          theme === 'light'
            ? 'bg-white shadow dark:bg-gray-700'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        ☀️
      </button>

      <button
        onClick={() => setTheme('system')}
        title="System mode"
        aria-label="System mode"
        className={`rounded-full p-1.5 text-sm transition-all ${
          theme === 'system'
            ? 'bg-white shadow dark:bg-gray-700'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        💻
      </button>

      <button
        onClick={() => setTheme('dark')}
        title="Dark mode"
        aria-label="Dark mode"
        className={`rounded-full p-1.5 text-sm transition-all ${
          theme === 'dark'
            ? 'bg-white shadow dark:bg-gray-700'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        🌙
      </button>
    </div>
  );
}
