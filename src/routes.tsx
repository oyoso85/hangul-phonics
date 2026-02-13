import { Routes, Route, Navigate } from 'react-router-dom'
import NicknameInput from './components/NicknameInput'
import CategorySelection from './components/CategorySelection'
import JamoCards from './components/JamoCards'
import JamoLearning from './components/JamoLearning'
import VocabularyCategories from './components/VocabularyCategories'
import VocabularyWordCards from './components/VocabularyWordCards'
import VocabularyLearning from './components/VocabularyLearning'
import SentenceCards from './components/SentenceCards'
import SentenceLearning from './components/SentenceLearning'
import QuizTypes from './components/quiz/QuizTypes'
import QuizCategories from './components/quiz/QuizCategories'
import QuizListenAndChoose from './components/quiz/QuizListenAndChoose'
import QuizImageToWord from './components/quiz/QuizImageToWord'
import QuizFirstSound from './components/quiz/QuizFirstSound'
import QuizSpelling from './components/quiz/QuizSpelling'
import QuizResult from './components/shared/QuizResult'
import PlayTypes from './components/play/PlayTypes'
import PlayCategories from './components/play/PlayCategories'
import PlayMatchingGame from './components/play/PlayMatchingGame'
import PlayDragAndDrop from './components/play/PlayDragAndDrop'
import LetterBuilderModes from './components/play/LetterBuilderModes'
import LetterBuilderBasic from './components/play/LetterBuilderBasic'
import LetterBuilderAdvanced from './components/play/LetterBuilderAdvanced'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<NicknameInput />} />
      <Route path="/select-category" element={<CategorySelection />} />

      {/* 자모 */}
      <Route path="/jamo" element={<JamoCards />} />
      <Route path="/jamo/learning" element={<JamoLearning />} />

      {/* 어휘 */}
      <Route path="/vocabulary-categories" element={<VocabularyCategories />} />
      <Route path="/vocabulary/:category/cards" element={<VocabularyWordCards />} />
      <Route path="/vocabulary/:category" element={<VocabularyLearning />} />

      {/* 문장 */}
      <Route path="/sentence-cards" element={<SentenceCards />} />
      <Route path="/sentence/learning" element={<SentenceLearning />} />

      {/* 퀴즈 */}
      <Route path="/quiz-types" element={<QuizTypes />} />
      <Route path="/quiz/:type/categories" element={<QuizCategories />} />
      <Route path="/quiz/listen-and-choose/:category" element={<QuizListenAndChoose />} />
      <Route path="/quiz/image-to-word/:category" element={<QuizImageToWord />} />
      <Route path="/quiz/first-sound/:category" element={<QuizFirstSound />} />
      <Route path="/quiz/spelling/:category" element={<QuizSpelling />} />
      <Route path="/quiz-result" element={<QuizResult />} />

      {/* 놀이 */}
      <Route path="/play-types" element={<PlayTypes />} />
      <Route path="/play/:type/categories" element={<PlayCategories />} />
      <Route path="/play/matching/:category" element={<PlayMatchingGame />} />
      <Route path="/play/drag-and-drop/:category" element={<PlayDragAndDrop />} />
      <Route path="/play/letter-builder" element={<LetterBuilderModes />} />
      <Route path="/play/letter-builder/basic" element={<LetterBuilderBasic />} />
      <Route path="/play/letter-builder/advanced" element={<LetterBuilderAdvanced />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
