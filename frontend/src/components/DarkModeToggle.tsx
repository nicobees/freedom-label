import { useState, useEffect } from 'react';

export function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="rounded-md bg-gray-200 p-2 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    >
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
