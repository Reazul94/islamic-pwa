import Dexie from 'dexie';

export const db = new Dexie('IslamicPwaDatabase');

db.version(1).stores({
  surahs: 'id, name, arabic, translation, bengali, verses_count, type, verses',
  hadiths: 'id, book, chapter, isnaad, bengali_isnaad, matn_ar, matn_en, matn_bn'
});
