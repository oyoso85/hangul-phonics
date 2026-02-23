// 자모 데이터 타입
export interface Jamo {
  id: string;
  letter: string;
  type: 'consonant' | 'vowel';
  name: string;
  exampleWord: string;
  emoji: string;
}

// 단어 데이터 타입
export interface VocabularyWord {
  id: string;
  spelling: string;
  emoji: string;
}

export type VocabularyCategory =
  | 'food'
  | 'animals'
  | 'vehicles'
  | 'body'
  | 'nature';

export interface VocabularyData {
  categories: Record<VocabularyCategory, VocabularyWord[]>;
}

// 문장 데이터 타입
export interface Sentence {
  text: string;
}

export interface SentenceSet {
  id: string;
  title: string;
  emoji: string;
  sentences: Sentence[];
}

// 오디오 재생 상태
export type AudioPlaybackState = 'idle' | 'playing' | 'waiting' | 'completed';

export interface AudioPlayerState {
  state: AudioPlaybackState;
  currentRepetition: number;
  totalRepetitions: number;
}

// 사용자 프로필
export interface UserProfile {
  nickname: string;
  lastVisited: string;
}

// 학습 카테고리
export type LearningCategory = 'jamo' | 'vocabulary' | 'sentence' | 'quiz' | 'play' | 'basic-pronunciation';

// 퀴즈 유형
export type QuizType = 'listen-and-choose' | 'image-to-word' | 'first-sound' | 'spelling';

// 놀이 유형
export type PlayType = 'matching' | 'drag-and-drop';

// 퀴즈/놀이 주제
export type QuizSubject = 'consonant' | 'vowel' | 'syllable' | 'syllable-batchim' | VocabularyCategory;

// 퀴즈 문제
export interface QuizQuestion {
  id: string;
  correctAnswer: { label: string; emoji: string };
  choices: { label: string; emoji: string }[];
  displayEmoji?: string;
  displayWord?: string;
  audioSrc?: string;
  missingLetterIndex?: number;
  letterChoices?: string[];
}

// 앱 전역 상태
export interface AppState {
  user: UserProfile | null;
  currentCategory: LearningCategory | null;
  selectedVocabularyCategory: VocabularyCategory | null;
}
