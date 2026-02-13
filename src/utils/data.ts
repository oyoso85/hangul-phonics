import type {
  Jamo,
  VocabularyData,
  VocabularyCategory,
  VocabularyWord,
  SentenceSet,
} from '../types';
import jamoJson from '../data/jamo.json';
import vocabularyJson from '../data/vocabulary.json';
import sentencesJson from '../data/sentences.json';

export function loadJamo(): { consonants: Jamo[]; vowels: Jamo[] } {
  return jamoJson as { consonants: Jamo[]; vowels: Jamo[] };
}

export function loadConsonants(): Jamo[] {
  return jamoJson.consonants as Jamo[];
}

export function loadVowels(): Jamo[] {
  return jamoJson.vowels as Jamo[];
}

export function loadAllJamo(): Jamo[] {
  return [...jamoJson.consonants, ...jamoJson.vowels] as Jamo[];
}

export function loadVocabulary(): VocabularyData {
  return vocabularyJson as VocabularyData;
}

export function loadVocabularyByCategory(category: VocabularyCategory): VocabularyWord[] {
  const data = loadVocabulary();
  return data.categories[category] ?? [];
}

export function loadSentences(): SentenceSet[] {
  return sentencesJson as SentenceSet[];
}

export function getVocabularyCategoryLabel(category: VocabularyCategory): string {
  const labels: Record<VocabularyCategory, string> = {
    'food': '음식',
    'animals': '동물',
    'vehicles': '탈것',
    'body': '신체',
    'nature': '자연',
  };
  return labels[category];
}

// 한글 첫 자음 추출
export function getFirstConsonant(char: string): string {
  const code = char.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return char;
  const consonants = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const index = Math.floor((code - 0xAC00) / 588);
  return consonants[index];
}
