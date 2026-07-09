import { create } from 'zustand'

export const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem('islamic_theme_color') || 'emerald',
  mode: localStorage.getItem('islamic_theme_mode') || 'light',
  
  setTheme: (color) => set(() => {
    localStorage.setItem('islamic_theme_color', color);
    
    // Update Document classes
    const root = document.documentElement;
    
    // Remove existing theme classes
    Array.from(root.classList).forEach(c => {
      if (c.startsWith('theme-')) {
        root.classList.remove(c);
      }
    });
    
    root.classList.add(`theme-${color}`);
    return { theme: color };
  }),
  
  toggleTheme: () => {
    const currentMode = get().mode;
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    localStorage.setItem('islamic_theme_mode', newMode);
    
    const root = document.documentElement;
    if (newMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    set({ mode: newMode });
  },
  
  initTheme: () => {
    const color = localStorage.getItem('islamic_theme_color') || 'emerald';
    const mode = localStorage.getItem('islamic_theme_mode') || 'light';
    
    const root = document.documentElement;
    
    // Apply color class
    Array.from(root.classList).forEach(c => {
      if (c.startsWith('theme-')) {
        root.classList.remove(c);
      }
    });
    root.classList.add(`theme-${color}`);
    
    // Apply mode class
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    set({ theme: color, mode });
  }
}));
