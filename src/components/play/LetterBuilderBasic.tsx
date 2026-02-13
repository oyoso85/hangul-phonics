import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ALL_CONSONANTS, ALL_VOWELS, composeHangul } from '../../utils/hangul';
import { playSyllable } from '../../utils/audio';

export default function LetterBuilderBasic() {
  const navigate = useNavigate();
  const [selectedCho, setSelectedCho] = useState<string | null>(null);
  const [selectedJung, setSelectedJung] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const prevLetterRef = useRef<string | null>(null);

  const composed = selectedCho && selectedJung ? composeHangul(selectedCho, selectedJung) : null;

  useEffect(() => {
    if (composed && composed !== prevLetterRef.current) {
      prevLetterRef.current = composed;
      playSyllable(composed).catch(() => {});
      setHistory((prev) => {
        const filtered = prev.filter((c) => c !== composed);
        const next = [...filtered, composed];
        return next.slice(-5);
      });
      // 선택 해제 (다음 글자를 처음부터 선택)
      setTimeout(() => {
        setSelectedCho(null);
        setSelectedJung(null);
        prevLetterRef.current = null;
      }, 600);
    }
  }, [composed]);

  const handleHistoryTap = (char: string) => {
    playSyllable(char).catch(() => {});
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-6">
      {/* Header */}
      <div className="w-full max-w-lg mb-3">
        <button
          onClick={() => navigate('/play/letter-builder')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-3 rounded-2xl hover:bg-muted active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">글자 만들기</span>
        </button>
      </div>

      {/* Composed letter display */}
      <div className="flex items-center justify-center w-full max-w-lg mb-6">
        <div className="w-32 h-32 rounded-3xl bg-white shadow-lg flex items-center justify-center border-4 border-blue-200">
          {composed ? (
            <button
              onClick={() => playSyllable(composed).catch(() => {})}
              className="text-7xl font-bold text-blue-600 hover:scale-110 transition-transform active:scale-95"
            >
              {composed}
            </button>
          ) : (
            <span className="text-2xl text-muted-foreground">?</span>
          )}
        </div>
      </div>

      {/* Consonants (left) + Vowels (right) */}
      <div className="flex gap-4 w-full max-w-lg mb-6">
        {/* Consonants */}
        <div className="flex-1">
          <h2 className="text-center text-sm font-bold text-muted-foreground mb-2">자음</h2>
          <div className="grid grid-cols-5 gap-1.5">
            {ALL_CONSONANTS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCho(c)}
                className={`aspect-square rounded-xl text-xl font-bold shadow-sm transition-all active:scale-90
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

        {/* Vowels */}
        <div className="flex-1">
          <h2 className="text-center text-sm font-bold text-muted-foreground mb-2">모음</h2>
          <div className="grid grid-cols-4 gap-1.5">
            {ALL_VOWELS.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedJung(v)}
                className={`aspect-square rounded-xl text-xl font-bold shadow-sm transition-all active:scale-90
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

      {/* History */}
      {history.length > 0 && (
        <div className="w-full max-w-lg">
          <h2 className="text-center text-sm font-bold text-muted-foreground mb-2">만든 글자</h2>
          <div className="flex justify-center gap-3">
            {history.map((char, i) => (
              <button
                key={`${char}-${i}`}
                onClick={() => handleHistoryTap(char)}
                className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-2xl font-bold text-gray-700 hover:bg-blue-50 hover:scale-105 transition-all active:scale-95"
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
