import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { QuizSubject, VocabularyCategory } from '../../types';
import { loadVocabularyByCategory, getVocabularyCategoryLabel } from '../../utils/data';
import { shuffle } from '../../utils/shuffle';
import { playCorrectSound, playWrongSound } from '../../utils/soundEffects';
import { QUIZ_SUBJECTS } from '../../utils/quiz';

interface DragCard {
  id: string;
  label: string;
  emoji: string;
  correctBucket: string;
  sorted: boolean;
}

function pickTwoBuckets(current: QuizSubject): { bucket1: VocabularyCategory; bucket2: VocabularyCategory } {
  const vocabCategories = QUIZ_SUBJECTS
    .filter((s) => s.id !== 'consonant' && s.id !== 'vowel')
    .map((s) => s.id as VocabularyCategory);

  if (current === 'consonant' || current === 'vowel') {
    const shuffled = shuffle(vocabCategories);
    return { bucket1: shuffled[0], bucket2: shuffled[1] };
  }

  const others = vocabCategories.filter((c) => c !== current);
  return { bucket1: current as VocabularyCategory, bucket2: shuffle(others)[0] };
}

export default function PlayDragAndDrop() {
  const navigate = useNavigate();
  const { category } = useParams<{ type: string; category: string }>();
  const subject = category as QuizSubject;

  const [cards, setCards] = useState<DragCard[]>([]);
  const [bucket1, setBucket1] = useState<VocabularyCategory>('food');
  const [bucket2, setBucket2] = useState<VocabularyCategory>('animals');
  const [sortedCount, setSortedCount] = useState(0);
  const [wrongCard, setWrongCard] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoveredBucket, setHoveredBucket] = useState<string | null>(null);
  const totalCards = 8;

  const touchRef = useRef<{ id: string; startX: number; startY: number; el: HTMLElement | null }>({ id: '', startX: 0, startY: 0, el: null });

  useEffect(() => {
    if (!subject) return;
    const { bucket1: b1, bucket2: b2 } = pickTwoBuckets(subject);
    setBucket1(b1);
    setBucket2(b2);

    const items1 = shuffle(loadVocabularyByCategory(b1)).slice(0, totalCards / 2);
    const items2 = shuffle(loadVocabularyByCategory(b2)).slice(0, totalCards / 2);

    const allCards: DragCard[] = [
      ...items1.map((w, i) => ({ id: `1-${i}`, label: w.spelling, emoji: w.emoji, correctBucket: b1, sorted: false })),
      ...items2.map((w, i) => ({ id: `2-${i}`, label: w.spelling, emoji: w.emoji, correctBucket: b2, sorted: false })),
    ];
    setCards(shuffle(allCards));
  }, [subject]);

  const handleDrop = (bucketId: VocabularyCategory, cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.sorted) return;

    if (card.correctBucket === bucketId) {
      playCorrectSound();
      setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, sorted: true } : c)));
      setSortedCount((s) => s + 1);
    } else {
      playWrongSound();
      setWrongCard(cardId);
      setTimeout(() => setWrongCard(null), 500);
    }
    setDraggingId(null);
    setHoveredBucket(null);
  };

  useEffect(() => {
    if (sortedCount === totalCards && sortedCount > 0) {
      setTimeout(() => {
        navigate('/quiz-result', {
          state: { score: totalCards, total: totalCards, backTo: `/play/drag-and-drop/categories` },
        });
      }, 500);
    }
  }, [sortedCount, navigate]);

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
    setDraggingId(cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (bucketId: string) => {
    setHoveredBucket(bucketId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (!related || !e.currentTarget.contains(related)) {
      setHoveredBucket(null);
    }
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setHoveredBucket(null);
  };

  const handleDropEvent = (e: React.DragEvent, bucketId: VocabularyCategory) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    handleDrop(bucketId, cardId);
  };

  const handleTouchStart = (e: React.TouchEvent, cardId: string) => {
    const touch = e.touches[0];
    const el = e.currentTarget as HTMLElement;
    touchRef.current = { id: cardId, startX: touch.clientX, startY: touch.clientY, el };
    setDraggingId(cardId);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current.el) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchRef.current.startX;
    const dy = touch.clientY - touchRef.current.startY;

    // 일정 거리 이상 움직이면 스크롤 방지 후 드래그 시작
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      e.preventDefault();
    }

    touchRef.current.el.style.transform = `translate(${dx}px, ${dy}px)`;
    touchRef.current.el.style.transition = 'none';
    touchRef.current.el.style.zIndex = '50';
    touchRef.current.el.style.pointerEvents = 'none';

    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const bucketEl = target?.closest('[data-bucket]');
    setHoveredBucket(bucketEl ? bucketEl.getAttribute('data-bucket') : null);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current.el) return;
    const el = touchRef.current.el;
    el.style.transform = '';
    el.style.transition = '';
    el.style.zIndex = '';
    el.style.pointerEvents = '';

    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    const bucketEl = dropTarget?.closest('[data-bucket]');
    if (bucketEl) {
      const bucketId = bucketEl.getAttribute('data-bucket') as VocabularyCategory;
      handleDrop(bucketId, touchRef.current.id);
    }
    setDraggingId(null);
    setHoveredBucket(null);
    touchRef.current = { id: '', startX: 0, startY: 0, el: null };
  };

  const b1Info = { label: getVocabularyCategoryLabel(bucket1), emoji: QUIZ_SUBJECTS.find((s) => s.id === bucket1)?.emoji ?? '📦' };
  const b2Info = { label: getVocabularyCategoryLabel(bucket2), emoji: QUIZ_SUBJECTS.find((s) => s.id === bucket2)?.emoji ?? '📦' };
  const unsortedCards = cards.filter((c) => !c.sorted);

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          알맞은 바구니에 넣어보세요! 🎯
        </h2>
        <p className="text-muted-foreground mt-1">{sortedCount}/{totalCards} 완료</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
        <div
          data-bucket={bucket1}
          onDragOver={handleDragOver}
          onDragEnter={() => handleDragEnter(bucket1)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDropEvent(e, bucket1)}
          className={`flex flex-col items-center justify-center p-6 rounded-3xl border-4 border-dashed min-h-[120px] transition-all duration-200 ${
            hoveredBucket === bucket1
              ? 'border-blue-500 bg-blue-100 scale-105 shadow-lg'
              : 'border-blue-300 bg-blue-50'
          }`}
        >
          <span className="text-4xl mb-1">{b1Info.emoji}</span>
          <span className="font-bold text-blue-700">{b1Info.label}</span>
          <span className="text-sm text-blue-500">
            {cards.filter((c) => c.sorted && c.correctBucket === bucket1).length}개
          </span>
        </div>
        <div
          data-bucket={bucket2}
          onDragOver={handleDragOver}
          onDragEnter={() => handleDragEnter(bucket2)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDropEvent(e, bucket2)}
          className={`flex flex-col items-center justify-center p-6 rounded-3xl border-4 border-dashed min-h-[120px] transition-all duration-200 ${
            hoveredBucket === bucket2
              ? 'border-orange-500 bg-orange-100 scale-105 shadow-lg'
              : 'border-orange-300 bg-orange-50'
          }`}
        >
          <span className="text-4xl mb-1">{b2Info.emoji}</span>
          <span className="font-bold text-orange-700">{b2Info.label}</span>
          <span className="text-sm text-orange-500">
            {cards.filter((c) => c.sorted && c.correctBucket === bucket2).length}개
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 w-full max-w-md">
        {unsortedCards.map((card) => (
          <div
            key={card.id}
            draggable
            onDragStart={(e) => handleDragStart(e, card.id)}
            onDragEnd={handleDragEnd}
            onTouchStart={(e) => handleTouchStart(e, card.id)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'none' }}
            className={`flex flex-col items-center justify-center px-4 py-3 rounded-2xl shadow-md bg-white cursor-grab active:cursor-grabbing transition-all select-none ${
              wrongCard === card.id ? 'animate-shake' : ''
            } ${draggingId === card.id ? 'opacity-70 scale-105' : 'hover:scale-105'}`}
          >
            <span className="text-3xl">{card.emoji}</span>
            <span className="text-sm font-semibold text-foreground mt-1">{card.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/play/drag-and-drop/categories')}
        className="mt-8 px-6 py-3 rounded-full bg-muted text-muted-foreground font-semibold hover:bg-gray-200 transition-colors"
      >
        ← 뒤로
      </button>
    </div>
  );
}
