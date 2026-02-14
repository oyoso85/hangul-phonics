## Context

현재 듣고 고르기 퀴즈는 `QuizSubject` 타입(`'consonant' | 'vowel' | VocabularyCategory`)에 따라 카테고리가 결정된다. 자모(ㄱ, ㅏ) 단위와 어휘(사과, 강아지) 단위 사이에 음절(가, 간) 단위 학습 단계가 빠져있다. 기존 `hangul.ts`에 `composeHangul` 함수가 있고, `public/audio/syllables/`에 3,564개 음절 MP3가 준비되어 있다.

## Goals / Non-Goals

**Goals:**
- 듣고 고르기 퀴즈에 '자음+모음'(받침 없는 음절)과 '자음+모음+받침'(쉬운 받침 음절) 카테고리 추가
- 기존 퀴즈 UI/UX를 그대로 재활용 (3지선다, 소리 2회 재생, 정답/오답 처리)
- 음절 데이터를 코드 내에서 `composeHangul`로 동적 생성 (별도 JSON 불필요)
- `public/audio/syllables/{글자}.mp3` 파일 활용

**Non-Goals:**
- 복합모음(ㅘ, ㅙ 등)이 포함된 음절은 이번 범위에 포함하지 않음
- 쌍자음(ㄲ, ㄸ 등) 초성 음절은 포함하지 않음
- 듣고 고르기 외 다른 퀴즈 유형(그림 보고 고르기, 첫소리, 받아쓰기)에는 추가하지 않음

## Decisions

### 1. 음절 데이터 생성: JSON vs 코드 내 동적 생성

**결정**: 코드 내에서 `composeHangul`로 동적 생성

**근거**: 기본 자음 14개 × 기본 모음 10개 = 140개 받침 없는 음절은 조합으로 충분히 생성 가능. 받침 있는 음절도 자음 × 모음 × 쉬운 받침 조합으로 생성. 별도 JSON 파일을 관리할 필요 없음.

### 2. 받침 있는 쉬운 글자 범위

**결정**: 기본 자음 14개 × 기본 모음 10개 × 대표 받침 7개(ㄱ,ㄴ,ㄷ,ㄹ,ㅁ,ㅂ,ㅇ)로 구성

**근거**: `REPRESENTATIVE_BATCHIM` 7개는 받침 발음의 대표음이며, 아이들이 학습하기에 적합한 범위. 겹받침(ㄳ, ㄵ 등)이나 복잡한 받침은 제외.

### 3. QuizSubject 타입 확장 방식

**결정**: `QuizSubject` 유니온 타입에 `'syllable'`과 `'syllable-batchim'` 추가

**근거**: 기존 `'consonant' | 'vowel' | VocabularyCategory` 패턴을 따라 문자열 리터럴 추가. `getSubjectData()`에서 분기 처리.

### 4. 음절 표시 레이아웃

**결정**: 자모와 동일하게 3열 그리드, 글자만 크게 표시 (`isJamoSubject` 판별 함수 확장)

**근거**: 음절도 단일 글자이므로 자모와 동일한 레이아웃이 적합. `isJamoSubject()` 함수를 `isLetterSubject()`로 확장하여 syllable 카테고리도 포함.

### 5. 오디오 경로

**결정**: 기존 `syllableAudioPath()` 함수 활용 → `{BASE}audio/syllables/{encodeURIComponent(글자)}.mp3`

**근거**: `audio.ts`에 이미 `syllableAudioPath()` 함수가 구현되어 있음. 그대로 사용.

### 6. QUIZ_SUBJECTS 배열 내 위치

**결정**: 자음, 모음 바로 다음에 '자음+모음', '자음+모음+받침' 순서로 배치

**근거**: 학습 난이도 순서 (자음 → 모음 → 자음+모음 → 자음+모음+받침 → 어휘)에 맞춤.

## Risks / Trade-offs

- **[오답 선택지 유사성]** 받침 없는 음절 140개, 받침 있는 음절 980개 중 랜덤 선택 시 시각적으로 유사한 글자가 선택지로 나올 수 있음 → 기존 랜덤 로직 유지 (학습에 오히려 도움)
- **[오디오 파일 누락]** 일부 음절의 MP3 파일이 없을 수 있음 → `syllableAudioPath`에 이미 TTS fallback이 `playSyllable()`에 구현되어 있으나, 듣고 고르기 퀴즈는 `playAudio()`를 직접 사용하므로 `syllableAudioPath`만 사용. 3,564개 파일로 대부분 커버됨.
