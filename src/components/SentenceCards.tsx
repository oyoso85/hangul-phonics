import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { loadSentences } from '../utils/data';

export default function SentenceCards() {
  const navigate = useNavigate();
  const sentences = loadSentences();

  const handleSelect = (index: number) => {
    navigate('/sentence/learning', { state: { startSetIndex: index } });
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-6">
      <div className="flex items-center justify-between w-full max-w-4xl mb-6">
        <button
          onClick={() => navigate('/select-category')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-3 rounded-2xl hover:bg-muted active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">뒤로</span>
        </button>
        <span className="text-lg font-medium px-4 py-2 rounded-full bg-cat-orange text-orange-600">
          💬 문장
        </span>
        <div className="w-24" />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2 animate-bounce-in animate-fill-both">
          문장을 골라보세요!
        </h2>
        <p className="text-muted-foreground">카드를 터치하면 문장을 들을 수 있어요</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        {sentences.map((set, index) => (
          <button
            key={set.id}
            onClick={() => handleSelect(index)}
            className="group flex flex-col items-center bg-card rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-in animate-fill-both"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-cat-orange flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="text-5xl md:text-6xl">{set.emoji}</span>
            </div>
            <span className="text-base md:text-lg font-bold text-foreground text-center">
              {set.title}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {set.sentences.length}문장
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
