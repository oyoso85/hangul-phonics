import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const playTypes = [
  { id: 'matching', label: '매칭 게임', icon: '🃏', bgColor: 'bg-cat-yellow', textColor: 'text-yellow-700', desc: '카드를 뒤집어 짝을 맞춰보세요' },
  { id: 'drag-and-drop', label: '분류 놀이', icon: '🎯', bgColor: 'bg-cat-red', textColor: 'text-red-600', desc: '카드를 알맞은 바구니에 넣어보세요' },
  { id: 'letter-builder', label: '글자 만들기', icon: '🔤', bgColor: 'bg-cat-green', textColor: 'text-green-700', desc: '자음과 모음을 합쳐 글자를 만들어요' },
];

export default function PlayTypes() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-8">
      <div className="w-full max-w-sm mb-4">
        <button
          onClick={() => navigate('/select-category')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md border border-gray-200 bg-white shadow-sm hover:bg-gray-50 active:scale-95"
        >
          <Home className="w-5 h-5" />
          <span className="text-lg font-medium">홈</span>
        </button>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-3 animate-bounce-in animate-fill-both">
          🎮 놀이
        </h1>
        <p className="text-xl text-muted-foreground">어떤 놀이를 할까요?</p>
      </div>

      <div className="grid grid-cols-1 gap-5 w-full max-w-sm">
        {playTypes.map((pt, index) => (
          <button
            key={pt.id}
            onClick={() => navigate(pt.id === 'letter-builder' ? '/play/letter-builder' : `/play/${pt.id}/categories`)}
            className={`group flex flex-col items-center justify-center ${pt.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-in animate-fill-both`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-5xl mb-2 group-hover:animate-float transition-transform">
              {pt.icon}
            </span>
            <span className={`text-xl font-bold ${pt.textColor}`}>
              {pt.label}
            </span>
            <span className="text-sm text-muted-foreground mt-1">{pt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
