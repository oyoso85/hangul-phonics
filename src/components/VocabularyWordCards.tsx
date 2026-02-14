import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { VocabularyCategory } from '../types';
import { loadVocabularyByCategory, getVocabularyCategoryLabel } from '../utils/data';

const categoryBadgeBg: Record<VocabularyCategory, string> = {
  'food': 'bg-cat-red text-red-600',
  'animals': 'bg-cat-green text-green-600',
  'vehicles': 'bg-cat-blue text-blue-600',
  'body': 'bg-cat-purple text-purple-600',
  'nature': 'bg-cat-yellow text-yellow-600',
};

const categoryCardBg: Record<VocabularyCategory, string> = {
  'food': 'bg-cat-red',
  'animals': 'bg-cat-green',
  'vehicles': 'bg-cat-blue',
  'body': 'bg-cat-purple',
  'nature': 'bg-cat-yellow',
};

export default function VocabularyWordCards() {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const vocabCategory = category as VocabularyCategory;
  const words = loadVocabularyByCategory(vocabCategory);

  const handleSelect = (index: number) => {
    navigate(`/vocabulary/${vocabCategory}`, { state: { startIndex: index } });
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-6">
      <div className="flex items-center justify-between w-full max-w-4xl mb-6">
        <button
          onClick={() => navigate('/vocabulary-categories')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md border border-gray-200 bg-white shadow-sm hover:bg-gray-50 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">뒤로</span>
        </button>
        <span className={`text-lg font-medium px-4 py-2 rounded-full ${categoryBadgeBg[vocabCategory]}`}>
          {getVocabularyCategoryLabel(vocabCategory)}
        </span>
        <div className="w-24" />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2 animate-bounce-in animate-fill-both">
          단어를 골라보세요!
        </h2>
        <p className="text-muted-foreground">카드를 터치하면 발음을 들을 수 있어요</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 w-full max-w-4xl">
        {words.map((word, index) => (
          <button
            key={word.id}
            onClick={() => handleSelect(index)}
            className="group flex flex-col items-center bg-card rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-in animate-fill-both"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${categoryCardBg[vocabCategory]} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
              <span className="text-4xl md:text-5xl">{word.emoji}</span>
            </div>
            <span className="text-sm md:text-base font-bold text-foreground truncate w-full text-center">
              {word.spelling}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
