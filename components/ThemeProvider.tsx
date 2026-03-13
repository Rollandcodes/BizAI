'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  setTheme: () => undefined,
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('cypai-theme') as Theme | null) ?? 'system';
    setThemeState(savedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let mediaQuery: MediaQueryList | null = null;
    let mediaHandler: ((event: MediaQueryListEvent) => void) | null = null;

    if (theme === 'dark') {
      root.classList.add('dark');
      setIsDark(true);
    } else if (theme === 'light') {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      root.classList.toggle('dark', mediaQuery.matches);
      setIsDark(mediaQuery.matches);

      mediaHandler = (event: MediaQueryListEvent) => {
        root.classList.toggle('dark', event.matches);
        setIsDark(event.matches);
      };

      mediaQuery.addEventListener('change', mediaHandler);
    }

    localStorage.setItem('cypai-theme', theme);

    return () => {
      if (mediaQuery && mediaHandler) {
        mediaQuery.removeEventListener('change', mediaHandler);
      }
    };
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: setThemeState,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
