import { db } from '../store/db';

const BASE_URL = 'https://api.alquran.cloud/v1';

// Pre-defined fallback Surah metadata (so the app works immediately if offline)
const fallbackSurahs = [
  { id: 1, name: "Al-Fatihah", arabic: "الفاتحة", translation: "The Opening", bengali: "আল-ফাতিহা", verses_count: 7, type: "Meccan" },
  { id: 2, name: "Al-Baqarah", arabic: "البقرة", translation: "The Cow", bengali: "আল-বাক্বারাহ", verses_count: 286, type: "Medinan" },
  { id: 3, name: "Ali 'Imran", arabic: "آل عمران", translation: "Family of Imran", bengali: "আলে ইমরান", verses_count: 200, type: "Medinan" },
  { id: 36, name: "Ya-Sin", arabic: "يس", translation: "Ya-Sin", bengali: "ইয়াসীন", verses_count: 83, type: "Meccan" },
  { id: 67, name: "Al-Mulk", arabic: "الملক", translation: "The Sovereignty", bengali: "আল-মূলক", verses_count: 30, type: "Meccan" },
  { id: 112, name: "Al-Ikhlas", arabic: "الإخلاص", translation: "Sincerity", bengali: "আল-ইখলাস", verses_count: 4, type: "Meccan" },
  { id: 113, name: "Al-Falaq", arabic: "الفلق", translation: "The Daybreak", bengali: "আল-ফালাক", verses_count: 5, type: "Meccan" },
  { id: 114, name: "An-Nas", arabic: "الناس", translation: "Mankind", bengali: "আন-নাস", verses_count: 6, type: "Meccan" }
];

export async function fetchSurahList() {
  try {
    const res = await fetch(`${BASE_URL}/surah`);
    const json = await res.json();
    if (json.code === 200) {
      // Map API structure to our own
      const list = json.data.map(s => ({
        id: s.number,
        name: s.englishName,
        arabic: s.name,
        translation: s.englishNameTranslation,
        bengali: getBengaliName(s.number), // Add Bengali name mapping
        verses_count: s.numberOfAyahs,
        type: s.revelationType
      }));
      // Save metadata to IndexedDB
      await db.surahs.bulkPut(list);
      return list;
    }
  } catch (error) {
    console.warn("Failed to fetch online Surah list, loading from IndexedDB cache...", error);
  }

  // Load from IndexedDB
  const cachedList = await db.surahs.toArray();
  if (cachedList.length > 0) return cachedList;

  // Fallback to initial seed
  return fallbackSurahs;
}

export async function fetchSurahDetails(surahId, reciterId = 'ar.alafasy') {
  // Check if we already have full verses cached in IndexedDB
  const cachedSurah = await db.surahs.get(surahId);
  if (cachedSurah && cachedSurah.verses && cachedSurah.verses.length > 0) {
    return cachedSurah;
  }

  try {
    // Fetch Arabic (with audio), English, and Bengali text editions
    const textRes = await fetch(`${BASE_URL}/surah/${surahId}/editions/quran-uthmani,en.sahih,bn.bengali`);
    const audioRes = await fetch(`${BASE_URL}/surah/${surahId}/${reciterId}`);
    
    const textJson = await textRes.json();
    const audioJson = await audioRes.json();

    if (textJson.code === 200 && audioJson.code === 200) {
      const arabicEd = textJson.data[0];
      const englishEd = textJson.data[1];
      const bengaliEd = textJson.data[2];
      const audioEd = audioJson.data;

      const verses = arabicEd.ayahs.map((ayah, idx) => ({
        number: ayah.numberInSurah,
        ar: ayah.text,
        en: englishEd.ayahs[idx].text,
        bn: bengaliEd.ayahs[idx].text,
        audio: audioEd.ayahs[idx].audio
      }));

      const surahData = {
        id: surahId,
        name: arabicEd.englishName,
        arabic: arabicEd.name,
        translation: arabicEd.englishNameTranslation,
        bengali: getBengaliName(surahId),
        verses_count: arabicEd.numberOfAyahs,
        type: arabicEd.revelationType,
        verses
      };

      // Cache detailed Surah text to IndexedDB
      await db.surahs.put(surahData);
      return surahData;
    }
  } catch (error) {
    console.error("Failed to fetch Surah details online", error);
  }

  // Final fallback to cached DB data
  if (cachedSurah) return cachedSurah;
  throw new Error("Surah not found offline. Connect to internet once to download.");
}

// Bengali Surah Names list mapping
function getBengaliName(id) {
  const bnNames = {
    1: "আল-ফাতিহা", 2: "আল-বাক্বারাহ", 3: "আলে ইমরান", 4: "আন-নিসা", 5: "আল-মায়িদাহ",
    36: "ইয়াসীন", 67: "আল-মূলক", 112: "আল-ইখলাস", 113: "আল-ফালাক", 114: "আন-নাস"
  };
  return bnNames[id] || `সূরা ${id}`;
}
