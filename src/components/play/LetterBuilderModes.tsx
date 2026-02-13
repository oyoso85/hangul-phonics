import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const modes = [
  { id: 'basic', label: '기본 글자 만들기', icon: '✏️', bgColor: 'bg-cat-blue', textColor: 'text-blue-700', desc: '자음 + 모음을 합쳐보세요' },
  { id: 'advanced', label: '받침 글자 만들기', icon: '📝', bgColor: 'bg-cat-purple', textColor: 'text-purple-700', desc: '자음 + 모음 + 받침을 합쳐보세요' },
];

export default function LetterBuilderModes() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-8">
      <div className="w-full max-w-sm mb-4">
        <button
          onClick={() => navigate('/play-types')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-3 rounded-2xl hover:bg-muted active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">놀이</span>
        </button>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-3 animate-bounce-in animate-fill-both">
          🔤 글자 만들기
        </h1>
        <p className="text-xl text-muted-foreground">어떤 방식으로 만들까요?</p>
      </div>

      <div className="grid grid-cols-1 gap-5 w-full max-w-sm">
        {modes.map((mode, index) => (
          <button
            key={mode.id}
            onClick={() => navigate(`/play/letter-builder/${mode.id}`)}
            className={`group flex flex-col items-center justify-center ${mode.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-in animate-fill-both`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-5xl mb-2 group-hover:animate-float transition-transform">
              {mode.icon}
            </span>
            <span className={`text-xl font-bold ${mode.textColor}`}>
              {mode.label}
            </span>
            <span className="text-sm text-muted-foreground mt-1">{mode.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
