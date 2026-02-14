import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CONSONANTS_BASIC, CONSONANTS_DOUBLE, VOWELS_BASIC, VOWELS_COMPLEX, composeHangul } from '../../utils/hangul';
import { playSyllable } from '../../utils/audio';

export default function LetterBuilderBasic() {
  const navigate = useNavigate();
  const [selectedCho, setSelectedCho] = useState<string | null>(null);
  const [selectedJung, setSelectedJung] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const composed = selectedCho && selectedJung ? composeHangul(selectedCho, selectedJung) : null;

  const handleComplete = () => {
    if (!composed) return;
    playSyllable(composed).catch(() => {});
    setHistory((prev) => {
      const filtered = prev.filter((c) => c !== composed);
      const next = [...filtered, composed];
      return next.slice(-5);
    });
    setSelectedCho(null);
    setSelectedJung(null);
  };

  const handleHistoryTap = (char: string) => {
    playSyllable(char).catch(() => {});
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-6">
      {/* Header */}
      <div className="w-full max-w-lg mb-3">
        <button
          onClick={() => navigate('/play/letter-builder')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md border border-gray-200 bg-white shadow-sm hover:bg-gray-50 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">글자 만들기</span>
        </button>
      </div>

      {/* Composed letter display + 완성 button */}
      <div className="flex items-center justify-center gap-4 w-full max-w-lg mb-6">
        <div className="w-32 h-32 rounded-3xl bg-white shadow-lg flex items-center justify-center border-4 border-blue-200">
          {composed ? (
            <span className="text-7xl font-bold text-blue-600">{composed}</span>
          ) : (
            <span className="text-2xl text-muted-foreground">?</span>
          )}
        </div>
        <button
          onClick={handleComplete}
          disabled={!composed}
          className={`px-6 py-4 rounded-2xl text-xl font-bold shadow-lg transition-all active:scale-95
            ${composed
              ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          완성!
        </button>
      </div>

      {/* Consonants (left) + Vowels (right) */}
      <div className="flex gap-3 w-full max-w-lg mb-6">
        {/* Consonants */}
        <div className="flex-1">
          <h2 className="text-center text-sm font-bold text-muted-foreground mb-2">자음</h2>
          <div className="grid grid-cols-4 gap-1.5">
            {[...CONSONANTS_BASIC, ...CONSONANTS_DOUBLE].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCho(c)}
                className={`w-full aspect-square rounded-xl text-lg font-bold shadow-sm transition-all active:scale-90
                  ${CONSONANTS_DOUBLE.includes(c) ? 'border-2 border-dashed' : ''}
                  ${selectedCho === c
                    ? 'bg-blue-500 text-white scale-105 shadow-md border-blue-500'
                    : CONSONANTS_DOUBLE.includes(c)
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
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
            {[...VOWELS_BASIC, ...VOWELS_COMPLEX].map((v) => (
              <button
                key={v}
                onClick={() => setSelectedJung(v)}
                className={`w-full aspect-square rounded-xl text-lg font-bold shadow-sm transition-all active:scale-90
                  ${VOWELS_COMPLEX.includes(v) ? 'border-2 border-dashed' : ''}
                  ${selectedJung === v
                    ? 'bg-rose-500 text-white scale-105 shadow-md border-rose-500'
                    : VOWELS_COMPLEX.includes(v)
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
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
