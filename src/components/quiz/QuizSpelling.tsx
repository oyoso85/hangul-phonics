import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { QuizQuestion, QuizSubject } from '../../types';
import { generateSpellingQuestions, getSubjectLabel } from '../../utils/quiz';
import { playAudio, stopAudio } from '../../utils/audio';
import { playCorrectSound, playWrongSound } from '../../utils/soundEffects';

export default function QuizSpelling() {
  const navigate = useNavigate();
  const { category } = useParams<{ type: string; category: string }>();
  const subject = category as QuizSubject;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [filledLetter, setFilledLetter] = useState<string | null>(null);

  useEffect(() => {
    if (subject) {
      setQuestions(generateSpellingQuestions(subject, 5));
    }
    return () => stopAudio();
  }, [subject]);

  const currentQ = questions[currentIndex];
  if (!currentQ || currentQ.missingLetterIndex === undefined) return null;

  const word = currentQ.displayWord ?? '';
  const missingIdx = currentQ.missingLetterIndex;

  const handleLetterChoice = async (letter: string) => {
    if (answered) return;

    const correctLetter = word[missingIdx];

    if (letter === correctLetter) {
      setAnswered(true);
      setFilledLetter(letter);
      setScore((s) => s + 1);
      playCorrectSound();
      try { if (currentQ.audioSrc) await playAudio(currentQ.audioSrc); } catch { /* ignore */ }

      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((i) => i + 1);
          setAnswered(false);
          setFilledLetter(null);
        } else {
          navigate(`/quiz-result`, {
            state: { score: score + 1, total: questions.length, backTo: `/quiz/spelling/categories` },
          });
        }
      }, 1500);
    } else {
      playWrongSound();
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const renderWord = () => {
    return word.split('').map((char, idx) => {
      if (idx === missingIdx && !filledLetter) {
        return (
          <span
            key={idx}
            className={`inline-block w-10 h-12 mx-0.5 border-b-4 border-primary text-center text-3xl font-bold ${
              shaking ? 'animate-shake' : ''
            }`}
          >
            _
          </span>
        );
      }
      return (
        <span
          key={idx}
          className={`inline-block w-10 h-12 mx-0.5 text-center text-3xl font-bold ${
            idx === missingIdx && filledLetter ? 'text-green-600' : 'text-foreground'
          }`}
        >
          {idx === missingIdx && filledLetter ? filledLetter : char}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8">
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground mb-1">
          {getSubjectLabel(subject)} · {currentIndex + 1} / {questions.length}
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          빈칸에 알맞은 글자를 고르세요 ✏️
        </h2>
      </div>

      <div className="my-6 flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center text-5xl animate-bounce-in animate-fill-both">
          {currentQ.displayEmoji}
        </div>
        <div className="flex items-center justify-center">
          {renderWord()}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-xs mt-4">
        {(currentQ.letterChoices ?? []).map((letter, idx) => (
          <button
            key={idx}
            onClick={() => handleLetterChoice(letter)}
            disabled={answered}
            className={`py-4 rounded-2xl shadow-md text-2xl font-bold transition-all duration-200 ${
              answered && letter === word[missingIdx]
                ? 'bg-green-100 text-green-700 scale-105'
                : answered
                ? 'opacity-50'
                : 'bg-white hover:bg-gray-50 hover:scale-105 active:scale-95 text-foreground'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate(`/quiz/spelling/categories`)}
        className="mt-8 px-6 py-3 rounded-full bg-muted text-muted-foreground font-semibold hover:bg-gray-200 transition-colors"
      >
        ← 뒤로
      </button>
    </div>
  );
}
