import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RotateCcw } from 'lucide-react';
import { CONSONANTS_BASIC, VOWELS_BASIC, CONSONANT_PHONEMES, VOWEL_PHONEMES, composeHangul } from '../../utils/hangul';
import { speakText, wait } from '../../utils/audio';

export default function BasicPronunciation() {
  const navigate = useNavigate();
  const [selectedCho, setSelectedCho] = useState<string | null>(null);
  const [selectedJung, setSelectedJung] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const cancelledRef = useRef(false);

  const playBlendingSequence = useCallback(async (cho: string, jung: string) => {
    const choSound = CONSONANT_PHONEMES[cho] ?? cho;
    const jungSound = VOWEL_PHONEMES[jung] ?? jung;
    const combined = choSound + jungSound;
    const syllable = composeHangul(cho, jung) ?? combined;

    cancelledRef.current = false;
    setIsPlaying(true);

    try {
      // 1단계: 자음 음가 + 모음 소리 분리 재생 (rate 0.6)
      await speakText(choSound, 'ko-KR', 0.6);
      if (cancelledRef.current) return;
      await wait(400);
      if (cancelledRef.current) return;
      await speakText(jungSound, 'ko-KR', 0.6);
      if (cancelledRef.current) return;

      await wait(1200);
      if (cancelledRef.current) return;

      // 2단계: 결합 텍스트 재생 (rate 0.9)
      await speakText(combined, 'ko-KR', 0.9);
      if (cancelledRef.current) return;

      await wait(800);
      if (cancelledRef.current) return;

      // 3단계: 결합 텍스트 빠르게 재생 (rate 1.4)
      await speakText(combined, 'ko-KR', 1.4);
      if (cancelledRef.current) return;

      await wait(600);
      if (cancelledRef.current) return;

      // 4단계: 완성 글자 정확한 발음 (rate 1.0)
      await speakText(syllable, 'ko-KR', 1.0);
    } catch {
      // silent fail
    } finally {
      if (!cancelledRef.current) {
        setIsPlaying(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!selectedCho || !selectedJung) return;

    cancelledRef.current = true;
    speechSynthesis.cancel();

    const timeout = setTimeout(() => {
      playBlendingSequence(selectedCho, selectedJung);
    }, 50);

    return () => clearTimeout(timeout);
  }, [selectedCho, selectedJung, playBlendingSequence]);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      speechSynthesis.cancel();
    };
  }, []);

  const handleReplay = useCallback(() => {
    if (!selectedCho || !selectedJung || isPlaying) return;
    cancelledRef.current = true;
    speechSynthesis.cancel();
    setTimeout(() => {
      playBlendingSequence(selectedCho, selectedJung);
    }, 50);
  }, [selectedCho, selectedJung, isPlaying, playBlendingSequence]);

  const composedChar = selectedCho && selectedJung ? composeHangul(selectedCho, selectedJung) : null;

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-6">
      {/* Header */}
      <div className="w-full max-w-lg mb-3">
        <button
          onClick={() => navigate('/select-category')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md border border-gray-200 bg-white shadow-sm hover:bg-gray-50 active:scale-95"
        >
          <Home className="w-5 h-5" />
          <span className="text-lg font-medium">홈</span>
        </button>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-1 animate-bounce-in animate-fill-both">
          🔊 기초 발음
        </h1>
        <p className="text-base text-muted-foreground">자음과 모음을 선택하면 발음을 들려줘요</p>
      </div>

      {/* 선택 표시: 자음 + 모음 = 완성글자 */}
      <div className="flex items-center justify-center gap-2 w-full max-w-lg mb-2">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-blue-200">
          <span className={`text-3xl font-bold ${selectedCho ? 'text-blue-600' : 'text-gray-300'}`}>
            {selectedCho ?? 'ㅡ'}
          </span>
        </div>
        <span className="text-xl font-bold text-muted-foreground">+</span>
        <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-rose-200">
          <span className={`text-3xl font-bold ${selectedJung ? 'text-rose-500' : 'text-gray-300'}`}>
            {selectedJung ?? 'ㅡ'}
          </span>
        </div>
        <span className="text-xl font-bold text-muted-foreground">=</span>
        <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-emerald-200">
          <span className={`text-3xl font-bold ${composedChar ? 'text-emerald-600' : 'text-gray-300'}`}>
            {composedChar ?? '?'}
          </span>
        </div>
      </div>

      {/* 재생 상태 + 다시 듣기 버튼 */}
      <div className="flex items-center justify-center h-10 mb-4">
        {isPlaying ? (
          <span className="text-sm text-blue-500 font-medium animate-pulse">재생 중...</span>
        ) : (selectedCho && selectedJung) ? (
          <button
            onClick={handleReplay}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium shadow hover:bg-blue-600 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            다시 듣기
          </button>
        ) : null}
      </div>

      {/* 자음 + 모음 그리드 */}
      <div className="flex gap-3 w-full max-w-lg">
        {/* 자음 */}
        <div className="flex-1">
          <h2 className="text-center text-sm font-bold text-muted-foreground mb-2">자음</h2>
          <div className="grid grid-cols-4 gap-1.5">
            {CONSONANTS_BASIC.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCho(c)}
                className={`w-full aspect-square rounded-xl text-lg font-bold shadow-sm transition-all active:scale-90
                  ${selectedCho === c
                    ? 'bg-blue-500 text-white scale-105 shadow-md'
                    : 'bg-white text-gray-700 hover:bg-blue-50'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 모음 */}
        <div className="flex-1">
          <h2 className="text-center text-sm font-bold text-muted-foreground mb-2">모음</h2>
          <div className="grid grid-cols-4 gap-1.5">
            {VOWELS_BASIC.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedJung(v)}
                className={`w-full aspect-square rounded-xl text-lg font-bold shadow-sm transition-all active:scale-90
                  ${selectedJung === v
                    ? 'bg-rose-500 text-white scale-105 shadow-md'
                    : 'bg-white text-gray-700 hover:bg-rose-50'
                  }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
