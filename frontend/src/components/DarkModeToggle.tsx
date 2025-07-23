
import { useState, useEffect } from 'react'

export function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
