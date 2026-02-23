## ADDED Requirements

### Requirement: 자음 음가 매핑 데이터
`src/utils/hangul.ts`에 기본 자음 14개의 음가를 정의한 `CONSONANT_PHONEMES` Record와 기본 모음 10개의 소리를 정의한 `VOWEL_PHONEMES` Record를 추가해야 한다(SHALL).

#### Scenario: 자음 음가 조회
- **WHEN** `CONSONANT_PHONEMES`에서 자음을 조회하면
- **THEN** `{ ㄱ:'그', ㄴ:'느', ㄷ:'드', ㄹ:'르', ㅁ:'므', ㅂ:'브', ㅅ:'스', ㅇ:'으', ㅈ:'즈', ㅊ:'츠', ㅋ:'크', ㅌ:'트', ㅍ:'프', ㅎ:'흐' }` 형태로 14개 항목이 존재한다

#### Scenario: 모음 소리 조회
- **WHEN** `VOWEL_PHONEMES`에서 모음을 조회하면
- **THEN** `{ ㅏ:'아', ㅑ:'야', ㅓ:'어', ㅕ:'여', ㅗ:'오', ㅛ:'요', ㅜ:'우', ㅠ:'유', ㅡ:'으', ㅣ:'이' }` 형태로 10개 항목이 존재한다

### Requirement: speakText rate 파라미터 확장
`src/utils/audio.ts`의 `speakText()` 함수는 선택적 `rate` 파라미터를 받아야 한다(SHALL). 기본값은 기존과 동일하게 0.8이며, 파라미터를 생략한 기존 호출부의 동작은 변경되지 않아야 한다(SHALL).

#### Scenario: 기본 rate 유지
- **WHEN** `speakText('가')`를 rate 없이 호출하면
- **THEN** `SpeechSynthesisUtterance.rate`가 0.8로 설정되어 재생된다

#### Scenario: 커스텀 rate 적용
- **WHEN** `speakText('그', 'ko-KR', 1.4)`를 호출하면
- **THEN** `SpeechSynthesisUtterance.rate`가 1.4로 설정되어 재생된다

### Requirement: 기초 발음 화면 자음/모음 선택 UI
`src/components/basic-pronunciation/BasicPronunciation.tsx`는 기본 자음 14개 그리드와 기본 모음 10개 그리드를 표시해야 한다(SHALL). 자음과 모음 각 1개를 독립적으로 선택할 수 있어야 한다(SHALL).

#### Scenario: 자음 카드 선택
- **WHEN** 자음 카드를 탭하면
- **THEN** 해당 자음이 선택 상태로 강조 표시된다
- **THEN** 이전에 선택된 자음은 선택 해제된다

#### Scenario: 모음 카드 선택
- **WHEN** 모음 카드를 탭하면
- **THEN** 해당 모음이 선택 상태로 강조 표시된다
- **THEN** 이전에 선택된 모음은 선택 해제된다

#### Scenario: 미선택 초기 상태
- **WHEN** 화면이 처음 표시되면
- **THEN** 자음과 모음 모두 선택되지 않은 상태이다

### Requirement: 3단계 가속 TTS 블렌딩 시퀀스 자동 재생
자음과 모음이 모두 선택된 순간 3단계 TTS 블렌딩 시퀀스를 자동으로 재생해야 한다(SHALL). 각 단계는 아래 사양을 따른다:

| 단계 | 재생 방식 | rate | 다음 단계까지 대기 |
|------|-----------|------|--------------------|
| 1    | 자음 음가 재생 → 400ms 대기 → 모음 소리 재생 (분리) | 0.6 | 1200ms |
| 2    | 자음 음가 + 모음 소리 결합 텍스트 재생 | 0.9 | 800ms |
| 3    | 자음 음가 + 모음 소리 결합 텍스트 재생 | 1.4 | — |

#### Scenario: 두 자모 선택 시 자동 재생 시작
- **WHEN** 자음과 모음이 모두 선택되면
- **THEN** 즉시 3단계 블렌딩 시퀀스 재생이 시작된다

#### Scenario: 1단계 분리 재생
- **WHEN** 블렌딩 시퀀스 1단계를 재생하면
- **THEN** 자음 음가(예: ㄱ→'그')를 rate 0.6으로 먼저 재생한다
- **THEN** 400ms 대기 후 모음 소리(예: ㅏ→'아')를 rate 0.6으로 재생한다

#### Scenario: 2단계·3단계 합산 재생
- **WHEN** 블렌딩 시퀀스 2단계를 재생하면
- **THEN** 자음 음가 + 모음 소리를 결합한 텍스트(예: '그아')를 rate 0.9로 재생한다
- **WHEN** 블렌딩 시퀀스 3단계를 재생하면
- **THEN** 동일한 결합 텍스트를 rate 1.4로 재생한다

#### Scenario: 재생 중 새 자모 선택 시 재시작
- **WHEN** 블렌딩 시퀀스 재생 중 다른 자음 또는 모음을 선택하면
- **THEN** 현재 재생이 즉시 중단된다
- **THEN** 새로운 조합으로 블렌딩 시퀀스가 처음부터 재시작된다

#### Scenario: 재생 중 UI 피드백
- **WHEN** 블렌딩 시퀀스를 재생하는 동안
- **THEN** 현재 재생 중임을 나타내는 시각적 인디케이터가 표시된다

### Requirement: 기초 발음 라우팅 및 카테고리 등록
기초 발음 화면은 `/basic-pronunciation` 경로로 접근 가능해야 하며(SHALL), 홈 화면(CategorySelection)에서 진입할 수 있어야 한다(SHALL).

#### Scenario: 카테고리 선택 화면에 기초 발음 표시
- **WHEN** CategorySelection 화면을 표시하면
- **THEN** '기초 발음' 레이블을 가진 카테고리 버튼이 표시된다

#### Scenario: 기초 발음 카테고리 탭 시 이동
- **WHEN** '기초 발음' 카테고리 버튼을 탭하면
- **THEN** `/basic-pronunciation` 경로로 이동한다
