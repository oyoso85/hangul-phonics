import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { playCompleteSound } from '../../utils/soundEffects';

interface ResultState {
  score: number;
  total: number;
  backTo: string;
  attempts?: number;
}

function getStars(score: number, total: number): string {
  const ratio = score / total;
  if (ratio >= 1) return '★★★';
  if (ratio >= 0.6) return '★★☆';
  return '★☆☆';
}

function getMessage(score: number, total: number): string {
  const ratio = score / total;
  if (ratio >= 1) return '완벽해요! 🎉';
  if (ratio >= 0.6) return '잘했어요! 👏';
  return '다시 도전해봐요! 💪';
}

export default function QuizResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultState | null;

  useEffect(() => {
    playCompleteSound();
  }, []);

  if (!state) {
    navigate('/select-category');
    return null;
  }

  const { score, total, backTo, attempts } = state;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8">
      <div className="text-center animate-bounce-in animate-fill-both">
        <div className="text-6xl mb-4 animate-celebrate">
          {getStars(score, total)}
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {getMessage(score, total)}
        </h1>
        <p className="text-2xl text-muted-foreground mb-2">
          {score} / {total} 정답
        </p>
        {attempts !== undefined && (
          <p className="text-lg text-muted-foreground">
            시도 횟수: {attempts}번
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-10 w-full max-w-xs">
        <button
          onClick={() => navigate(backTo)}
          className="px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          다시 하기
        </button>
        <button
          onClick={() => navigate('/select-category')}
          className="px-6 py-4 rounded-2xl bg-muted text-muted-foreground font-bold text-lg hover:bg-gray-200 transition-colors"
        >
          뒤로
        </button>
      </div>
    </div>
  );
}
