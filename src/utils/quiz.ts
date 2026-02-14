import type { Jamo, VocabularyWord, QuizQuestion, QuizSubject } from '../types';
import { loadConsonants, loadVowels, loadVocabularyByCategory, getFirstConsonant } from './data';
import { jamoAudioPath, vocabularyAudioPath, syllableAudioPath } from './audio';
import { shuffle } from './shuffle';
import type { VocabularyCategory } from '../types';
import { composeHangul, CONSONANTS_BASIC, VOWELS_BASIC } from './hangul';

function pickRandom<T>(arr: T[], count: number, exclude?: T[]): T[] {
  const pool = exclude ? arr.filter((item) => !exclude.includes(item)) : [...arr];
  return shuffle(pool).slice(0, count);
}

interface QuizItem {
  label: string;
  emoji: string;
  word: string;
  audioSrc: string;
}

function jamoToQuizItem(j: Jamo): QuizItem {
  return { label: j.letter, emoji: j.letter, word: j.name, audioSrc: jamoAudioPath(j.id) };
}

function vocabToQuizItem(w: VocabularyWord, category: string): QuizItem {
  return { label: w.spelling, emoji: w.emoji, word: w.spelling, audioSrc: vocabularyAudioPath(category, w.id) };
}

function generateSyllableItems(): QuizItem[] {
  const items: QuizItem[] = [];
  for (const cho of CONSONANTS_BASIC) {
    for (const jung of VOWELS_BASIC) {
      const syllable = composeHangul(cho, jung);
      if (syllable) {
        items.push({ label: syllable, emoji: syllable, word: syllable, audioSrc: syllableAudioPath(syllable) });
      }
    }
  }
  return items;
}

// 자주 쓰이는 받침 있는 음절 (~100개)
const COMMON_BATCHIM_SYLLABLES = [
  // ㄱ 초성
  '각', '간', '갈', '감', '강', '갑',
  '건', '걸', '검',
  '결', '견',
  '곡', '곤', '골', '공', '곰',
  '관', '광',
  '국', '군', '굴', '궁',
  '근', '글', '금', '급',
  '긴', '길',
  // ㄴ 초성
  '난', '날', '남',
  '눈', '늘', '능',
  // ㄷ 초성
  '단', '달', '담', '당', '답',
  '돈', '돌', '동',
  // ㄹ 초성
  '란', '랑',
  // ㅁ 초성
  '만', '말', '맘', '망',
  '먹', '멀', '명',
  '목', '몸', '몽',
  '문', '물',
  '민', '밀',
  // ㅂ 초성
  '반', '발', '밤', '밥', '방', '박',
  '번', '벌', '별', '병',
  '본', '봄', '봉', '복',
  '분', '불', '북',
  // ㅅ 초성
  '산', '살', '삼', '상',
  '선', '설', '성',
  '손', '솔', '송',
  '순', '술',
  '신', '실', '심',
  // ㅇ 초성
  '안', '알',
  '언', '얼', '엄',
  '온', '올',
  '운', '울', '음',
  '원', '월',
  '은', '을', '응',
  '인', '일', '임',
  // ㅈ 초성
  '잔', '잘', '잠', '장',
  '전', '절', '점', '정',
  '종', '준', '줄', '중',
  '진', '질',
  // ㅊ 초성
  '찬', '참', '창',
  '천', '철', '청',
  // ㅋ 초성
  '콩', '큰',
  // ㅌ 초성
  '탄', '탈', '통',
  // ㅍ 초성
  '판', '팔', '편', '평', '품', '풍', '풀',
  // ㅎ 초성
  '한', '할', '함', '항',
  '헌', '험',
  '혼', '홍',
  '훈',
];

function generateSyllableBatchimItems(): QuizItem[] {
  return COMMON_BATCHIM_SYLLABLES.map((syllable) => ({
    label: syllable, emoji: syllable, word: syllable, audioSrc: syllableAudioPath(syllable),
  }));
}

export function getSubjectData(subject: QuizSubject): QuizItem[] {
  if (subject === 'consonant') {
    return loadConsonants().map(jamoToQuizItem);
  }
  if (subject === 'vowel') {
    return loadVowels().map(jamoToQuizItem);
  }
  if (subject === 'syllable') {
    return generateSyllableItems();
  }
  if (subject === 'syllable-batchim') {
    return generateSyllableBatchimItems();
  }
  const category = subject as VocabularyCategory;
  return loadVocabularyByCategory(category).map((w) => vocabToQuizItem(w, category));
}

export function generateQuizQuestions(
  subject: QuizSubject,
  count: number = 5
): QuizQuestion[] {
  const items = getSubjectData(subject);
  const selected = shuffle(items).slice(0, Math.min(count, items.length));

  return selected.map((item, idx) => {
    const others = pickRandom(items, 2, [item]);
    const choices = shuffle([
      { label: item.label, emoji: item.emoji },
      ...others.map((o) => ({ label: o.label, emoji: o.emoji })),
    ]);

    return {
      id: `q-${idx}`,
      correctAnswer: { label: item.label, emoji: item.emoji },
      choices,
      displayEmoji: item.emoji,
      displayWord: item.word,
      audioSrc: item.audioSrc,
    };
  });
}

export function generateSpellingQuestions(
  subject: QuizSubject,
  count: number = 5
): QuizQuestion[] {
  const items = getSubjectData(subject);
  const eligible = items.filter((item) => item.word.length >= 2);
  const selected = shuffle(eligible).slice(0, Math.min(count, eligible.length));

  return selected.map((item, idx) => {
    const word = item.word;
    const missingIndex = 1 + Math.floor(Math.random() * (word.length - 1));
    const correctLetter = word[missingIndex];

    // Generate wrong letter choices from other words' characters
    const allChars = items
      .flatMap((i) => i.word.split(''))
      .filter((c) => c !== correctLetter);
    const uniqueWrong = [...new Set(allChars)];
    const wrongLetters = shuffle(uniqueWrong).slice(0, 3);
    const letterChoices = shuffle([correctLetter, ...wrongLetters]);

    return {
      id: `sp-${idx}`,
      correctAnswer: { label: item.label, emoji: item.emoji },
      choices: [],
      displayEmoji: item.emoji,
      displayWord: word,
      audioSrc: item.audioSrc,
      missingLetterIndex: missingIndex,
      letterChoices,
    };
  });
}

export function generateFirstSoundQuestions(
  subject: QuizSubject,
  count: number = 5
): QuizQuestion[] {
  const allConsonants = loadConsonants();
  const items = getSubjectData(subject);
  const selected = shuffle(items).slice(0, Math.min(count, items.length));

  return selected.map((item, idx) => {
    const firstChar = item.word[0];
    const firstConsonant = getFirstConsonant(firstChar);
    const wrongConsonants = pickRandom(
      allConsonants.filter((c) => c.letter !== firstConsonant),
      2
    );
    const choices = shuffle([
      { label: firstConsonant, emoji: firstConsonant },
      ...wrongConsonants.map((c) => ({ label: c.letter, emoji: c.letter })),
    ]);

    return {
      id: `fs-${idx}`,
      correctAnswer: { label: firstConsonant, emoji: firstConsonant },
      choices,
      displayEmoji: item.emoji,
      displayWord: item.word,
      audioSrc: item.audioSrc,
    };
  });
}

export function getSubjectLabel(subject: QuizSubject): string {
  const labels: Record<string, string> = {
    consonant: '자음',
    vowel: '모음',
    syllable: '자음+모음',
    'syllable-batchim': '자음+모음+받침',
    food: '음식',
    animals: '동물',
    vehicles: '탈것',
    body: '신체',
    nature: '자연',
  };
  return labels[subject] ?? subject;
}

export const QUIZ_SUBJECTS: { id: QuizSubject; label: string; emoji: string }[] = [
  { id: 'consonant', label: '자음', emoji: 'ㄱ' },
  { id: 'vowel', label: '모음', emoji: 'ㅏ' },
  { id: 'syllable', label: '자음+모음', emoji: '가' },
  { id: 'syllable-batchim', label: '자음+모음+받침', emoji: '간' },
  { id: 'food', label: '음식', emoji: '🍎' },
  { id: 'animals', label: '동물', emoji: '🐶' },
  { id: 'vehicles', label: '탈것', emoji: '🚗' },
  { id: 'body', label: '신체', emoji: '🖐️' },
  { id: 'nature', label: '자연', emoji: '🌳' },
];
