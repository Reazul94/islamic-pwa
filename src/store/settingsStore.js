import { create } from 'zustand'

export const useSettingsStore = create((set) => ({
  madhhab: localStorage.getItem('madhhab') || 'standard',
  coordinates: JSON.parse(localStorage.getItem('coordinates')) || { latitude: 23.8103, longitude: 90.4125 }, // Default Dhaka
  locationName: localStorage.getItem('locationName') || 'Dhaka, Bangladesh',
  
  setMadhhab: (madhhab) => set(() => {
    localStorage.setItem('madhhab', madhhab);
    return { madhhab };
  }),
  
  setCoordinates: (lat, lng, name) => set(() => {
    const coords = { latitude: lat, longitude: lng };
    localStorage.setItem('coordinates', JSON.stringify(coords));
    localStorage.setItem('locationName', name);
    return { coordinates: coords, locationName: name };
  })
}));
