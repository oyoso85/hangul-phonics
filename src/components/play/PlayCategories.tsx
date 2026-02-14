import { useNavigate, useParams } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { QUIZ_SUBJECTS } from '../../utils/quiz';
import type { QuizSubject } from '../../types';

const LETTER_SUBJECTS: QuizSubject[] = ['consonant', 'vowel', 'syllable', 'syllable-batchim'];

const playTypeLabels: Record<string, string> = {
  'matching': '매칭 게임',
  'drag-and-drop': '분류 놀이',
};

export default function PlayCategories() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-8">
      <div className="flex items-center justify-between w-full max-w-lg mb-4">
        <button
          onClick={() => navigate('/select-category')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md border border-gray-200 bg-white shadow-sm hover:bg-gray-50 active:scale-95"
        >
          <Home className="w-5 h-5" />
          <span className="text-lg font-medium">홈</span>
        </button>
        <button
          onClick={() => navigate('/play-types')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md border border-gray-200 bg-white shadow-sm hover:bg-gray-50 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">뒤로</span>
        </button>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-3 animate-bounce-in animate-fill-both">
          {playTypeLabels[type ?? ''] ?? '놀이'}
        </h1>
        <p className="text-xl text-muted-foreground">주제를 선택하세요</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 w-full max-w-lg">
        {QUIZ_SUBJECTS.filter((subj) => !LETTER_SUBJECTS.includes(subj.id)).map((subj, index) => (
          <button
            key={subj.id}
            onClick={() => navigate(`/play/${type}/${subj.id}`)}
            className="group flex flex-col items-center justify-center bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-in animate-fill-both"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <span className="text-4xl mb-2 group-hover:animate-float transition-transform">
              {subj.emoji}
            </span>
            <span className="text-base font-bold text-foreground text-center">
              {subj.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
