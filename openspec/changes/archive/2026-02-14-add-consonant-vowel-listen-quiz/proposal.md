## Why

자음과 모음을 개별적으로 학습하는 메뉴(자음 듣고 고르기, 모음 듣고 고르기)는 있지만, 그 다음 단계인 자음+모음을 합쳐서 읽는 학습이 빠져 있다. 자모를 익힌 후 음절 단위로 읽는 연습이 어휘 학습 전에 필요하며, 받침 없는 글자(가, 나, 다…)와 받침 있는 쉬운 글자(간, 달, 밥…)를 단계적으로 학습할 수 있어야 한다.

## What Changes

- 퀴즈 > 듣고 고르기 카테고리에 **'자음+모음'** 항목 추가 (받침 없는 음절: 가, 나, 더, 보 등)
- 퀴즈 > 듣고 고르기 카테고리에 **'자음+모음+받침'** 항목 추가 (받침 있는 쉬운 음절: 간, 달, 밥, 콩 등)
- 두 카테고리 모두 기존 듣고 고르기 퀴즈 UI를 그대로 활용 (소리 듣고 3개 중 고르기)
- 음절 데이터셋 추가 (받침 없는 음절 목록, 받침 있는 쉬운 음절 목록)
- 음절 오디오는 기존 녹음 파일 활용 (`public/audio/syllables/가.mp3` 등 3,564개 파일 보유)

## Capabilities

### New Capabilities

- `syllable-quiz-data`: 음절 퀴즈용 데이터셋 정의 (받침 없는 음절 목록, 받침 있는 쉬운 음절 목록, QuizItem 변환 로직)

### Modified Capabilities

- `quiz-categories`: 듣고 고르기 퀴즈 카테고리 목록에 '자음+모음', '자음+모음+받침' 2개 항목 추가. QuizSubject 타입 확장.

## Impact

- `src/types.ts` — QuizSubject 타입에 새 카테고리 추가
- `src/data/` — 음절 데이터 파일 추가 (syllables.json 또는 코드 내 생성)
- `src/utils/data.ts` — 새 카테고리에 대한 getSubjectData 로직 추가
- `src/utils/audio.ts` — 음절 오디오 경로 함수 추가 (`public/audio/syllables/{글자}.mp3`)
- `src/components/quiz/QuizCategories.tsx` — 카테고리 버튼 추가
- `src/components/quiz/QuizListenAndChoose.tsx` — 음절 표시 레이아웃 처리 (자모와 유사하게 글자만 표시)
