# quiz-categories Specification

## Purpose
TBD - created by archiving change add-consonant-vowel-listen-quiz. Update Purpose after archive.
## Requirements
### Requirement: QuizSubject 타입에 음절 카테고리 추가
`QuizSubject` 타입에 `'syllable'`과 `'syllable-batchim'` 리터럴을 추가해야 한다(SHALL).

#### Scenario: QuizSubject 타입 정의
- **WHEN** QuizSubject 타입을 사용하면
- **THEN** `'consonant' | 'vowel' | 'syllable' | 'syllable-batchim' | VocabularyCategory` 형태이다

### Requirement: QUIZ_SUBJECTS 배열에 음절 항목 추가
`QUIZ_SUBJECTS` 배열에 자음+모음과 자음+모음+받침 항목을 추가해야 한다(SHALL). 위치는 '모음' 바로 다음이다.

#### Scenario: QUIZ_SUBJECTS 배열 구성
- **WHEN** QUIZ_SUBJECTS 배열을 조회하면
- **THEN** 자음, 모음, 자음+모음, 자음+모음+받침, 음식, 동물, 탈것, 신체, 자연 순서이다

#### Scenario: 자음+모음 항목
- **WHEN** QUIZ_SUBJECTS에서 syllable 항목을 조회하면
- **THEN** `{ id: 'syllable', label: '자음+모음', emoji: '가' }` 형태이다

#### Scenario: 자음+모음+받침 항목
- **WHEN** QUIZ_SUBJECTS에서 syllable-batchim 항목을 조회하면
- **THEN** `{ id: 'syllable-batchim', label: '자음+모음+받침', emoji: '간' }` 형태이다

### Requirement: getSubjectLabel에 음절 레이블 추가
`getSubjectLabel()` 함수가 음절 카테고리에 대해 올바른 레이블을 반환해야 한다(SHALL).

#### Scenario: 음절 레이블 반환
- **WHEN** `getSubjectLabel('syllable')`을 호출하면
- **THEN** `'자음+모음'`을 반환한다
- **WHEN** `getSubjectLabel('syllable-batchim')`을 호출하면
- **THEN** `'자음+모음+받침'`을 반환한다

### Requirement: 듣고 고르기 퀴즈에서 음절 레이아웃
듣고 고르기 퀴즈에서 음절 카테고리는 자모와 동일하게 3열 그리드로 글자만 크게 표시해야 한다(SHALL).

#### Scenario: 음절 카테고리의 UI 레이아웃
- **WHEN** subject가 `'syllable'` 또는 `'syllable-batchim'`일 때 듣고 고르기 퀴즈를 표시하면
- **THEN** 3열 그리드 레이아웃으로 표시한다
- **THEN** 각 선택지에 글자만 크게 표시한다 (이모지+단어 형태가 아님)

