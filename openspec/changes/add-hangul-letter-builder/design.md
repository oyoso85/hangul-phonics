## Context

한글 파닉스 앱의 '놀이' 섹션에 '글자 만들기' 놀이를 추가한다. 현재 놀이 섹션에는 매칭 게임과 분류 놀이 2종이 있으며, 새로 추가되는 글자 만들기는 카테고리 선택 없이 바로 모드를 선택하는 구조이다.

기존 앱은 React + TypeScript + Vite + Tailwind CSS 스택이며, `src/components/play/` 하위에 놀이 컴포넌트가 위치한다. 오디오는 사전 녹음된 MP3 파일(`public/audio/`)을 재생하는 방식이지만, 글자 만들기에서는 동적으로 조합된 글자를 읽어야 하므로 다른 접근이 필요하다.

## Goals / Non-Goals

**Goals:**
- 자음+모음 조합(방식 1)과 자음+모음+받침 조합(방식 2)으로 한글 글자를 만드는 놀이 제공
- 조합된 글자를 TTS로 즉시 읽어주기
- 완성 글자 히스토리(최대 5개)를 하단에 표시하고 탭하면 재생
- 기존 Play 섹션의 UI/UX 패턴과 일관성 유지

**Non-Goals:**
- 쌍자음(ㄲ, ㄸ 등), 복합모음(ㅢ, ㅟ 등) 지원 — 향후 확장 가능
- 글자 만들기 결과 저장/통계
- 사전 녹음 MP3 파일 생성

## Decisions

### 1. TTS 방식: Web Speech API (`speechSynthesis`)

조합 가능한 글자 수가 수백 개에 달해 사전 녹음이 비현실적이다. 브라우저 내장 `speechSynthesis`를 사용하여 동적으로 한국어 음성을 생성한다.

- **대안 고려**: 외부 TTS API (Google Cloud TTS 등) → 네트워크 의존성과 비용 발생, 오프라인 불가
- **결정 근거**: 무료, 오프라인 지원, 추가 의존성 없음. 한국어 음성은 대부분의 모바일/데스크톱 브라우저에서 지원됨

```typescript
// utils/audio.ts에 추가
export function speakText(text: string, lang = 'ko-KR'): Promise<void> {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8; // 아이 학습용으로 느리게
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    speechSynthesis.cancel(); // 이전 발화 중단
    speechSynthesis.speak(utterance);
  });
}
```

### 2. 한글 조합 로직: Unicode 연산

한글 유니코드 공식을 사용하여 자모를 글자로 조합한다.

```
완성형 = 0xAC00 + (초성인덱스 × 21 × 28) + (중성인덱스 × 28) + 종성인덱스
```

- 초성 14자, 중성 10자(기본 모음), 종성 0(없음) + 받침 자음
- `src/utils/hangul.ts` 유틸리티 파일을 새로 생성

### 3. 라우팅 구조: 모드 선택 → 각 모드 페이지

글자 만들기는 카테고리가 불필요하므로, PlayTypes에서 선택 시 모드 선택 화면으로 바로 이동한다.

```
/play/letter-builder          → LetterBuilderModes (방식 1/2 선택)
/play/letter-builder/basic    → LetterBuilderBasic (초성+중성)
/play/letter-builder/advanced → LetterBuilderAdvanced (초성+중성+종성)
```

- **대안 고려**: 하나의 컴포넌트에서 토글로 모드 전환 → 컴포넌트 복잡도 증가, 각 모드의 레이아웃이 다르므로 분리가 적절

### 4. UI 레이아웃

**방식 1 (Basic)**:
```
┌─────────────────────────────┐
│        [합쳐진 글자]          │
│           가                 │
├──────────┬──────────────────┤
│  자음     │  모음             │
│  ㄱ ㄴ ㄷ │  ㅏ ㅑ ㅓ         │
│  ㄹ ㅁ ㅂ │  ㅕ ㅗ ㅛ         │
│  ㅅ ㅇ ㅈ │  ㅜ ㅠ ㅡ         │
│  ㅊ ㅋ ㅌ │  ㅣ              │
│  ㅍ ㅎ   │                  │
├─────────────────────────────┤
│  완성 목록: [가] [나] [다]    │
└─────────────────────────────┘
```

**방식 2 (Advanced)**: 동일 레이아웃 + 하단에 받침 선택 영역 추가

```
┌─────────────────────────────┐
│        [합쳐진 글자]          │
│           간                 │
├──────────┬──────────────────┤
│  자음     │  모음             │
│  (동일)   │  (동일)           │
├─────────────────────────────┤
│  받침: ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ...  │
├─────────────────────────────┤
│  완성 목록: [간] [난] [단]    │
└─────────────────────────────┘
```

### 5. 컴포넌트 구조

| 파일 | 역할 |
|------|------|
| `play/LetterBuilderModes.tsx` | 방식 1/2 선택 화면 |
| `play/LetterBuilderBasic.tsx` | 초성+중성 조합 놀이 |
| `play/LetterBuilderAdvanced.tsx` | 초성+중성+종성 조합 놀이 |
| `utils/hangul.ts` | 한글 유니코드 조합 유틸리티 |

Basic과 Advanced는 자모 선택 UI가 동일하므로, 공통 로직은 각 컴포넌트 내에서 직접 구현한다 (별도 공통 컴포넌트 추출은 하지 않음 — 두 컴포넌트 뿐이므로).

## Risks / Trade-offs

- **[TTS 음성 품질이 기기/브라우저마다 다름]** → 한국어 음성이 없는 환경에서는 fallback 없이 무음 처리. 대부분의 한국 사용자 기기에서는 문제 없음
- **[speechSynthesis가 iOS Safari에서 사용자 제스처 필요]** → 글자 카드 탭 자체가 사용자 제스처이므로 자연스럽게 충족됨
- **[받침으로 사용 가능한 자음이 초성과 다름]** → 종성 인덱스 매핑 테이블을 별도로 정의하여 정확한 조합 보장
