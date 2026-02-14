## 1. 타입 및 데이터 계층

- [x] 1.1 `src/types.ts`의 `QuizSubject` 타입에 `'syllable' | 'syllable-batchim'` 추가
- [x] 1.2 `src/utils/quiz.ts`에 음절 데이터 생성 함수 추가 — `composeHangul`로 받침 없는 140개, 받침 있는 980개 음절 QuizItem 배열 생성
- [x] 1.3 `src/utils/quiz.ts`의 `getSubjectData()`에 `'syllable'`과 `'syllable-batchim'` 분기 추가

## 2. 퀴즈 카테고리 UI

- [x] 2.1 `src/utils/quiz.ts`의 `QUIZ_SUBJECTS` 배열에 모음 다음 위치에 `{ id: 'syllable', label: '자음+모음', emoji: '가' }`와 `{ id: 'syllable-batchim', label: '자음+모음+받침', emoji: '간' }` 추가
- [x] 2.2 `src/utils/quiz.ts`의 `getSubjectLabel()`에 `syllable: '자음+모음'`, `'syllable-batchim': '자음+모음+받침'` 추가

## 3. 듣고 고르기 퀴즈 레이아웃

- [x] 3.1 `src/components/quiz/QuizListenAndChoose.tsx`의 `isJamoSubject()` 함수를 확장하여 `'syllable'`과 `'syllable-batchim'`도 3열 글자 레이아웃으로 표시되도록 수정

## 4. 검증

- [x] 4.1 빌드 오류 없이 컴파일되는지 확인 (`npm run build`)
- [x] 4.2 듣고 고르기 > 자음+모음 카테고리 선택 → 퀴즈 정상 동작 확인
- [x] 4.3 듣고 고르기 > 자음+모음+받침 카테고리 선택 → 퀴즈 정상 동작 확인
