import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const quizTypes = [
  { id: 'listen-and-choose', label: '듣고 고르기', icon: '🔊', bgColor: 'bg-cat-blue', textColor: 'text-blue-600' },
  { id: 'image-to-word', label: '그림 보고 단어 고르기', icon: '🖼️', bgColor: 'bg-cat-green', textColor: 'text-green-600' },
  { id: 'first-sound', label: '첫소리 맞추기', icon: '🔤', bgColor: 'bg-cat-orange', textColor: 'text-orange-600' },
  { id: 'spelling', label: '받아쓰기', icon: '✏️', bgColor: 'bg-cat-purple', textColor: 'text-purple-600' },
];

export default function QuizTypes() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-8">
      <div className="w-full max-w-lg mb-4">
        <button
          onClick={() => navigate('/select-category')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-3 rounded-2xl hover:bg-muted active:scale-95"
        >
          <Home className="w-5 h-5" />
          <span className="text-lg font-medium">홈</span>
        </button>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-3 animate-bounce-in animate-fill-both">
          🧩 퀴즈
        </h1>
        <p className="text-xl text-muted-foreground">어떤 퀴즈를 풀어볼까요?</p>
      </div>

      <div className="grid grid-cols-2 gap-5 w-full max-w-lg">
        {quizTypes.map((qt, index) => (
          <button
            key={qt.id}
            onClick={() => navigate(`/quiz/${qt.id}/categories`)}
            className={`group flex flex-col items-center justify-center ${qt.bgColor} rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-in animate-fill-both`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-4xl mb-2 group-hover:animate-float transition-transform">
              {qt.icon}
            </span>
            <span className={`text-base font-bold ${qt.textColor} text-center`}>
              {qt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
