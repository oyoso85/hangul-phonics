import type { Jamo, VocabularyWord, QuizQuestion, QuizSubject } from '../types';
import { loadConsonants, loadVowels, loadVocabularyByCategory, getFirstConsonant } from './data';
import { jamoAudioPath, vocabularyAudioPath } from './audio';
import { shuffle } from './shuffle';
import type { VocabularyCategory } from '../types';

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

export function getSubjectData(subject: QuizSubject): QuizItem[] {
  if (subject === 'consonant') {
    return loadConsonants().map(jamoToQuizItem);
  }
  if (subject === 'vowel') {
    return loadVowels().map(jamoToQuizItem);
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
  { id: 'food', label: '음식', emoji: '🍎' },
  { id: 'animals', label: '동물', emoji: '🐶' },
  { id: 'vehicles', label: '탈것', emoji: '🚗' },
  { id: 'body', label: '신체', emoji: '🖐️' },
  { id: 'nature', label: '자연', emoji: '🌳' },
];
