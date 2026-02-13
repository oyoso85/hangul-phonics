import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { loadConsonants, loadVowels } from '../utils/data';

export default function JamoCards() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'consonant' | 'vowel'>('consonant');
  const consonants = loadConsonants();
  const vowels = loadVowels();
  const jamoList = tab === 'consonant' ? consonants : vowels;

  const handleSelect = (index: number) => {
    navigate('/jamo/learning', { state: { startIndex: index, type: tab } });
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
        <span className="text-lg font-medium px-4 py-2 rounded-full bg-cat-blue text-blue-600">
          🔤 자모
        </span>
        <div className="w-24" />
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab('consonant')}
          className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all ${
            tab === 'consonant'
              ? 'bg-primary text-primary-foreground shadow-lg scale-105'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          자음 (14)
        </button>
        <button
          onClick={() => setTab('vowel')}
          className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all ${
            tab === 'vowel'
              ? 'bg-primary text-primary-foreground shadow-lg scale-105'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          모음 (10)
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2 animate-bounce-in animate-fill-both">
          {tab === 'consonant' ? '자음' : '모음'}을 골라보세요!
        </h2>
        <p className="text-muted-foreground">카드를 터치하면 발음을 들을 수 있어요</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 w-full max-w-4xl">
        {jamoList.map((jamo, index) => (
          <button
            key={jamo.id}
            onClick={() => handleSelect(index)}
            className="group flex flex-col items-center bg-card rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-in animate-fill-both"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-cat-blue flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="text-4xl md:text-5xl">{jamo.emoji}</span>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-primary">{jamo.letter}</span>
            <span className="text-xs md:text-sm text-muted-foreground mt-1">
              {jamo.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
