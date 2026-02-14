// 초성 (19개 - 유니코드 순서)
const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

// 중성 (21개 - 유니코드 순서)
const JUNGSEONG = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
];

// 종성 (28개 - 0은 받침 없음, 유니코드 순서)
const JONGSEONG = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

// 앱에서 사용하는 자음 19개 (기본 14 + 쌍자음 5)
export const ALL_CONSONANTS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

// 앱에서 사용하는 모음 21개 (기본 10 + 복합모음 11)
export const ALL_VOWELS = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
];

// 기본 자음/모음 (하위호환)
export const BASIC_CONSONANTS = ALL_CONSONANTS;
export const BASIC_VOWELS = ALL_VOWELS;

// 자음 그룹 (UI 표시용)
export const CONSONANTS_BASIC = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
export const CONSONANTS_DOUBLE = ['ㄲ', 'ㄸ', 'ㅃ', 'ㅆ', 'ㅉ'];

// 모음 그룹 (UI 표시용)
export const VOWELS_BASIC = ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];
export const VOWELS_COMPLEX = ['ㅐ', 'ㅒ', 'ㅔ', 'ㅖ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ'];

// 받침으로 사용 가능한 자음 (쌍받침 ㄲ, ㅆ 포함)
export const BATCHIM_CONSONANTS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

export function composeHangul(
  choseong: string,
  jungseong: string,
  jongseong?: string,
): string | null {
  const cho = CHOSEONG.indexOf(choseong);
  const jung = JUNGSEONG.indexOf(jungseong);
  if (cho === -1 || jung === -1) return null;

  const jong = jongseong ? JONGSEONG.indexOf(jongseong) : 0;
  if (jong === -1) return null;

  const code = 0xac00 + cho * 21 * 28 + jung * 28 + jong;
  return String.fromCharCode(code);
}

// 한글 음절 분해
export function decomposeHangul(char: string): { cho: string; jung: string; jong: string } | null {
  const code = char.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return null;

  const offset = code - 0xac00;
  const choIdx = Math.floor(offset / (21 * 28));
  const jungIdx = Math.floor((offset % (21 * 28)) / 28);
  const jongIdx = offset % 28;

  return {
    cho: CHOSEONG[choIdx],
    jung: JUNGSEONG[jungIdx],
    jong: JONGSEONG[jongIdx],
  };
}

// 받침 대표음 규칙 (음절 끝소리 규칙)
// ㄱ,ㄲ,ㅋ → [ㄱ] / ㄴ → [ㄴ] / ㄷ,ㅅ,ㅆ,ㅈ,ㅊ,ㅌ,ㅎ → [ㄷ]
// ㄹ → [ㄹ] / ㅁ → [ㅁ] / ㅂ,ㅍ → [ㅂ] / ㅇ → [ㅇ]
const BATCHIM_REPRESENTATIVE: Record<string, string> = {
  'ㄱ': 'ㄱ', 'ㄲ': 'ㄱ', 'ㅋ': 'ㄱ',
  'ㄴ': 'ㄴ',
  'ㄷ': 'ㄷ', 'ㅅ': 'ㄷ', 'ㅆ': 'ㄷ', 'ㅈ': 'ㄷ', 'ㅊ': 'ㄷ', 'ㅌ': 'ㄷ', 'ㅎ': 'ㄷ',
  'ㄹ': 'ㄹ',
  'ㅁ': 'ㅁ',
  'ㅂ': 'ㅂ', 'ㅍ': 'ㅂ',
  'ㅇ': 'ㅇ',
};

// 현대 한국어 모음 병합 (발음 동일)
// ㅐ≈ㅔ, ㅒ≈ㅖ, ㅙ≈ㅚ≈ㅞ
const VOWEL_REPRESENTATIVE: Record<string, string> = {
  'ㅐ': 'ㅔ',
  'ㅒ': 'ㅖ',
  'ㅙ': 'ㅞ',
  'ㅚ': 'ㅞ',
};

// 음절의 대표 발음 글자 반환 (오디오 파일 매핑용)
export function normalizeForAudio(syllable: string): string {
  const parts = decomposeHangul(syllable);
  if (!parts) return syllable;

  const normJung = VOWEL_REPRESENTATIVE[parts.jung] ?? parts.jung;
  const normJong = parts.jong ? (BATCHIM_REPRESENTATIVE[parts.jong] ?? parts.jong) : undefined;

  return composeHangul(parts.cho, normJung, normJong) ?? syllable;
}

// 대표 받침 목록 (오디오 생성용)
export const REPRESENTATIVE_BATCHIM = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅇ'];

// 대표 모음 목록 (오디오 생성용 - 병합된 모음 제외)
export const REPRESENTATIVE_VOWELS = [
  'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ',
  'ㅔ', 'ㅖ', 'ㅘ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ',
];
