## ADDED Requirements

### Requirement: 받침 없는 음절 데이터 생성
시스템은 기본 자음 14개(ㄱ,ㄴ,ㄷ,ㄹ,ㅁ,ㅂ,ㅅ,ㅇ,ㅈ,ㅊ,ㅋ,ㅌ,ㅍ,ㅎ)와 기본 모음 10개(ㅏ,ㅑ,ㅓ,ㅕ,ㅗ,ㅛ,ㅜ,ㅠ,ㅡ,ㅣ)를 조합하여 받침 없는 음절 목록(총 140개)을 생성해야 한다(SHALL). `composeHangul` 함수를 사용하여 유니코드 합성한다.

#### Scenario: 받침 없는 음절 목록 생성
- **WHEN** subject가 `'syllable'`일 때 `getSubjectData`를 호출하면
- **THEN** 기본 자음 14개 × 기본 모음 10개 = 140개의 음절 QuizItem 배열을 반환한다
- **THEN** 각 QuizItem의 label과 emoji는 합성된 음절 글자(예: '가', '나')이다
- **THEN** 각 QuizItem의 audioSrc는 `syllableAudioPath(글자)` 경로이다

#### Scenario: 받침 없는 음절 예시 확인
- **WHEN** 'ㄱ' + 'ㅏ' 조합을 생성하면
- **THEN** label이 '가'인 QuizItem이 포함된다
- **THEN** audioSrc는 `{BASE}audio/syllables/%EA%B0%80.mp3` 형태이다

### Requirement: 받침 있는 쉬운 음절 데이터 생성
시스템은 기본 자음 14개, 기본 모음 10개, 대표 받침 7개(ㄱ,ㄴ,ㄷ,ㄹ,ㅁ,ㅂ,ㅇ)를 조합하여 받침 있는 음절 목록(총 980개)을 생성해야 한다(SHALL). `composeHangul` 함수에 종성을 포함하여 합성한다.

#### Scenario: 받침 있는 음절 목록 생성
- **WHEN** subject가 `'syllable-batchim'`일 때 `getSubjectData`를 호출하면
- **THEN** 기본 자음 14개 × 기본 모음 10개 × 대표 받침 7개 = 980개의 음절 QuizItem 배열을 반환한다
- **THEN** 각 QuizItem의 label과 emoji는 합성된 음절 글자(예: '간', '달')이다

#### Scenario: 받침 있는 음절 예시 확인
- **WHEN** 'ㄱ' + 'ㅏ' + 'ㄴ' 조합을 생성하면
- **THEN** label이 '간'인 QuizItem이 포함된다

### Requirement: 음절 QuizItem 변환 형식
음절 데이터의 QuizItem은 기존 자모 QuizItem과 동일한 형식을 따라야 한다(SHALL).

#### Scenario: QuizItem 필드 구성
- **WHEN** 음절 '가'에 대한 QuizItem을 생성하면
- **THEN** `{ label: '가', emoji: '가', word: '가', audioSrc: syllableAudioPath('가') }` 형태이다

### Requirement: 음절 오디오 경로
음절의 오디오는 `public/audio/syllables/{글자}.mp3` 파일을 사용해야 한다(SHALL). 기존 `syllableAudioPath()` 함수를 활용한다.

#### Scenario: 음절 오디오 재생
- **WHEN** 음절 퀴즈 문제가 출제되면
- **THEN** 해당 음절의 `syllableAudioPath(글자)` 경로로 오디오를 재생한다
