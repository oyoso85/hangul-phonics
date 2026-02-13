import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { QuizQuestion, QuizSubject } from '../../types';
import { generateQuizQuestions, getSubjectLabel } from '../../utils/quiz';
import { playAudio, stopAudio } from '../../utils/audio';
import { playCorrectSound, playWrongSound } from '../../utils/soundEffects';

export default function QuizImageToWord() {
  const navigate = useNavigate();
  const { category } = useParams<{ type: string; category: string }>();
  const subject = category as QuizSubject;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (subject) {
      setQuestions(generateQuizQuestions(subject, 5));
    }
    return () => stopAudio();
  }, [subject]);

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const handleChoice = async (choice: { label: string }) => {
    if (answered) return;

    if (choice.label === currentQ.correctAnswer.label) {
      setAnswered(true);
      setScore((s) => s + 1);
      playCorrectSound();
      try { if (currentQ.audioSrc) await playAudio(currentQ.audioSrc); } catch { /* ignore */ }

      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((i) => i + 1);
          setAnswered(false);
        } else {
          navigate(`/quiz-result`, {
            state: { score: score + 1, total: questions.length, backTo: `/quiz/image-to-word/categories` },
          });
        }
      }, 1200);
    } else {
      playWrongSound();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8">
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground mb-1">
          {getSubjectLabel(subject)} · {currentIndex + 1} / {questions.length}
        </p>
        <h2 className="text-2xl font-bold text-foreground">
          그림을 보고 단어를 고르세요 🖼️
        </h2>
      </div>

      <div className="my-8">
        <div className="w-32 h-32 rounded-3xl bg-white shadow-xl flex items-center justify-center text-6xl animate-bounce-in animate-fill-both">
          {currentQ.displayEmoji}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
        {currentQ.choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => handleChoice(choice)}
            disabled={answered}
            className={`px-6 py-4 rounded-2xl shadow-md text-lg font-semibold transition-all duration-200 ${
              answered && choice.label === currentQ.correctAnswer.label
                ? 'bg-green-100 text-green-700 scale-105'
                : answered
                ? 'opacity-50'
                : 'bg-white hover:bg-gray-50 hover:scale-102 active:scale-95 text-foreground'
            }`}
          >
            {choice.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate(`/quiz/image-to-word/categories`)}
        className="mt-8 px-6 py-3 rounded-full bg-muted text-muted-foreground font-semibold hover:bg-gray-200 transition-colors"
      >
        ← 뒤로
      </button>
    </div>
  );
}
