import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'light',
  setTheme: (newTheme) => set(() => {
    localStorage.setItem('theme', newTheme);
    
    // Remove all theme classes first
    const root = document.documentElement;
    root.className = ''; 
    root.classList.add(`theme-${newTheme}`);
    
    // Maintain class='dark' for general Tailwind components if needed
    if (['dark', 'dracula', 'onedark', 'nord'].includes(newTheme)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    return { theme: newTheme };
  }),
  initTheme: () => {
    const theme = localStorage.getItem('theme') || 'light';
    const root = document.documentElement;
    root.className = '';
    root.classList.add(`theme-${theme}`);
    if (['dark', 'dracula', 'onedark', 'nord'].includes(theme)) {
      root.classList.add('dark');
    }
    set({ theme });
  }
}));
