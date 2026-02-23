let currentAudio: HTMLAudioElement | null = null;

export function playAudio(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    stopAudio();
    const audio = new Audio(src);
    currentAudio = audio;
    audio.onended = () => {
      currentAudio = null;
      resolve();
    };
    audio.onerror = () => {
      currentAudio = null;
      reject(new Error(`Failed to play: ${src}`));
    };
    audio.play().catch(reject);
  });
}

export function stopAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 오디오 경로 헬퍼
const BASE = import.meta.env.BASE_URL;

export function jamoAudioPath(jamoId: string): string {
  return `${BASE}audio/jamo/${jamoId}.mp3`;
}

export function jamoWordAudioPath(jamoId: string): string {
  return `${BASE}audio/words/${jamoId}.mp3`;
}

export function vocabularyAudioPath(category: string, wordId: string): string {
  return `${BASE}audio/vocabulary/${category}/${wordId}.mp3`;
}

export function sentenceAudioPath(setId: string, index: number): string {
  return `${BASE}audio/sentences/${setId}/${index}.mp3`;
}

// 음절 오디오 경로
export function syllableAudioPath(syllable: string): string {
  return `${BASE}audio/syllables/${encodeURIComponent(syllable)}.mp3`;
}

// 음절 발음 재생 (정규화된 발음의 MP3 우선, TTS fallback)
export async function playSyllable(syllable: string): Promise<void> {
  const { normalizeForAudio } = await import('./hangul');
  const normalized = normalizeForAudio(syllable);
  try {
    await playAudio(syllableAudioPath(normalized));
  } catch {
    // MP3 없으면 TTS fallback
    return speakText(syllable);
  }
}

// TTS (Web Speech API)
export function speakText(text: string, lang = 'ko-KR', rate = 0.8): Promise<void> {
  return new Promise((resolve, reject) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    speechSynthesis.speak(utterance);
  });
}
