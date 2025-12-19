import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Toujours démarrer en mode sombre, peu importe le choix précédent
    document.documentElement.classList.add('dark');
    setIsDark(true);
    
    // Mais permettre à l'utilisateur de basculer et sauvegarder son choix
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  // Synchroniser le DOM avec l'état isDark
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return { isDark, toggleTheme };
};
