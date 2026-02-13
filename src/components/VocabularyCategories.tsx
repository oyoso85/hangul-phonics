import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import type { VocabularyCategory } from '../types';
import { getVocabularyCategoryLabel } from '../utils/data';

const vocabCategories: { id: VocabularyCategory; icon: string; bgColor: string; textColor: string }[] = [
  { id: 'food', icon: '🍎', bgColor: 'bg-cat-red', textColor: 'text-red-600' },
  { id: 'animals', icon: '🐶', bgColor: 'bg-cat-green', textColor: 'text-green-600' },
  { id: 'vehicles', icon: '🚗', bgColor: 'bg-cat-blue', textColor: 'text-blue-600' },
  { id: 'body', icon: '🖐️', bgColor: 'bg-cat-purple', textColor: 'text-purple-600' },
  { id: 'nature', icon: '🌳', bgColor: 'bg-cat-yellow', textColor: 'text-yellow-600' },
];

export default function VocabularyCategories() {
  const { setVocabularyCategory } = useAppContext();
  const navigate = useNavigate();

  const handleSelect = (category: VocabularyCategory) => {
    setVocabularyCategory(category);
    navigate(`/vocabulary/${category}/cards`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-6 py-8">
      <div className="flex items-center justify-between w-full max-w-2xl mb-8">
        <button
          onClick={() => navigate('/select-category')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-3 rounded-2xl hover:bg-muted active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">뒤로</span>
        </button>
        <h1 className="text-2xl font-bold text-foreground">단어 카테고리</h1>
        <div className="w-24" />
      </div>

      <div className="grid grid-cols-2 gap-5 w-full max-w-2xl">
        {vocabCategories.map((cat, index) => (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.id)}
            className={`group flex flex-col items-center justify-center ${cat.bgColor} rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-in animate-fill-both`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-4xl mb-3 group-hover:animate-float transition-transform">
              {cat.icon}
            </span>
            <span className={`text-lg font-bold ${cat.textColor}`}>
              {getVocabularyCategoryLabel(cat.id)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
