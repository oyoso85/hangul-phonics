## Why

현재 앱에는 자음의 '이름'(기억, 니은 등)이 아닌 실제 '음가'(그, 느 등)를 기반으로 자음과 모음이 합쳐지는 과정을 청각적으로 학습하는 기능이 없다. 파닉스 교육의 핵심인 음소 혼합(phoneme blending)을 단계적 속도 변화로 체험할 수 있는 '기초 발음' 카테고리를 추가한다.

## What Changes

- 홈(CategorySelection)에 '기초 발음' 카테고리 항목 추가 (`LearningCategory` 타입에 `'basic-pronunciation'` 추가)
- **기초 발음 화면**: 자음 카드와 모음 카드를 각각 하나씩 선택하면 음가 기반 발음 재생 시작
  - 자음은 이름이 아닌 음가로 발음: ㄱ→'그', ㄴ→'느', ㄷ→'드', ㄹ→'르', ㅁ→'므' 등
  - 모음은 그대로 발음: ㅏ→'아', ㅗ→'오', ㅣ→'이' 등
  - 선택 후 자음 음가 + 모음 을 3회 재생, 매 회 점점 빠르게 → 마지막엔 합쳐진 음절처럼 들림
  - 예시: ㄱ+ㅏ → '그'·'아' / '그아' / '가(빠르게)' 순으로 재생
  - 예시: ㄹ+ㅗ → '르'·'오' / '르오' / '로(빠르게)' 순으로 재생

## Capabilities

### New Capabilities
- `basic-pronunciation`: 자음의 음가와 모음을 선택하여 점진적으로 빠르게 3회 재생함으로써 음소 혼합을 청각적으로 학습하는 기능. 자음 음가 매핑 데이터, 선택 UI, 단계별 오디오 재생 시퀀스 포함.

### Modified Capabilities
- `quiz-categories`: `LearningCategory` 타입(또는 동일 위치의 카테고리 열거)에 `'basic-pronunciation'` 값 추가 필요. 기존 퀴즈·학습 라우팅 로직은 변경 없음.

## Impact

- **타입**: `src/types.ts`의 `LearningCategory` 유니온 타입에 `'basic-pronunciation'` 추가
- **라우팅**: `src/routes.tsx`에 `/basic-pronunciation` 라우트 추가
- **홈 화면**: `src/components/CategorySelection.tsx`에 '기초 발음' 버튼 추가
- **컴포넌트**: `src/components/basic-pronunciation/` 디렉터리에 신규 컴포넌트 추가
- **데이터**: 자음별 음가 문자열 매핑 추가 (기존 `jamo.json` 확장 또는 별도 상수)
- **오디오**: Web Speech API(`speechSynthesis`)로 동적 TTS 재생, 재생 간격 타이밍 제어 필요
