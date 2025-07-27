import { useState, useEffect } from 'react';

const useDarkMode = () => {
  // Estado para el modo oscuro
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Función para aplicar el tema
  const applyTheme = (dark: any) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Función para detectar preferencia del sistema
  const getSystemPreference = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  // Inicializar el tema
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Intentar obtener la preferencia guardada
        const savedTheme = localStorage.getItem('darkMode');
        
        let initialDarkMode;
        if (savedTheme !== null) {
          // Si hay una preferencia guardada, usarla
          initialDarkMode = JSON.parse(savedTheme);
        } else {
          // Si no hay preferencia guardada, usar la del sistema
          initialDarkMode = getSystemPreference();
        }

        setIsDarkMode(initialDarkMode);
        applyTheme(initialDarkMode);
      } catch (error) {
        console.error('Error al cargar la preferencia de tema:', error);
        // En caso de error, usar preferencia del sistema
        const systemPref = getSystemPreference();
        setIsDarkMode(systemPref);
        applyTheme(systemPref);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        // Solo cambiar si no hay preferencia guardada explícitamente
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme === null) {
          setIsDarkMode(e.matches);
          applyTheme(e.matches);
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Función para toggle del modo oscuro
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Usar toggle es más directo
    document.documentElement.classList.toggle('dark');
    
    try {
      localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    } catch (error) {
      console.error('Error al guardar la preferencia de tema:', error);
    }
  };

  // Función para establecer el tema manualmente
  const setDarkMode = (dark: boolean | ((prevState: boolean) => boolean)) => {
    setIsDarkMode(dark);
    applyTheme(dark);
    
    try {
      localStorage.setItem('darkMode', JSON.stringify(dark));
    } catch (error) {
      console.error('Error al guardar la preferencia de tema:', error);
    }
  };

  // Función para resetear a la preferencia del sistema
  const resetToSystemPreference = () => {
    try {
      localStorage.removeItem('darkMode');
      const systemPref = getSystemPreference();
      setIsDarkMode(systemPref);
      applyTheme(systemPref);
    } catch (error) {
      console.error('Error al resetear la preferencia de tema:', error);
    }
  };

  return {
    isDarkMode,
    isLoading,
    toggleDarkMode,
    setDarkMode,
    resetToSystemPreference,
    systemPreference: getSystemPreference()
  };
};

export default useDarkMode;