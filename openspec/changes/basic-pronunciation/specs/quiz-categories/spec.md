## ADDED Requirements

### Requirement: LearningCategory에 기초 발음 추가
`src/types.ts`의 `LearningCategory` 유니온 타입에 `'basic-pronunciation'` 리터럴을 추가해야 한다(SHALL).

#### Scenario: LearningCategory 타입 정의
- **WHEN** `LearningCategory` 타입을 사용하면
- **THEN** `'jamo' | 'vocabulary' | 'sentence' | 'quiz' | 'play' | 'basic-pronunciation'` 형태이다
