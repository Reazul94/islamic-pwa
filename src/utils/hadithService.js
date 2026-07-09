import { db } from '../store/db';
import localHadithData from '../data/hadith.json';

// Fetch hadiths online and cache in Dexie.js
export async function fetchHadithList(book = 'bukhari') {
  // Pre-seed some default local hadiths if IndexedDB is empty
  const count = await db.hadiths.count();
  if (count === 0) {
    await db.hadiths.bulkPut(localHadithData);
  }

  try {
    const res = await fetch(`https://hadith-api.vercel.app/books/${book}`);
    const json = await res.json();
    if (json && json.hadiths) {
      const list = json.hadiths.slice(0, 100).map(h => ({
        id: `${book}-${h.number}`,
        book: book.toUpperCase(),
        chapter: h.chapter || "General",
        isnaad: h.englishNarrator || "Narrated by Companion:",
        bengali_isnaad: "বর্ণিত হয়েছে:",
        matn_ar: h.arab || "",
        matn_en: h.english || "",
        matn_bn: h.bengali || h.english // Fallback to english if bengali isn't present
      }));

      await db.hadiths.bulkPut(list);
      return list;
    }
  } catch (error) {
    console.warn("Failed to fetch online Hadiths, loading from cache...", error);
  }

  // Load from IndexedDB
  const cachedList = await db.hadiths.where('book').equals(book.toUpperCase()).toArray();
  if (cachedList.length > 0) return cachedList;

  return localHadithData.filter(h => h.book.toLowerCase().includes(book.toLowerCase()));
}
