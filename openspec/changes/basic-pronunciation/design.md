## Context

현재 앱은 자모 학습, 단어, 문장, 퀴즈, 놀이 5개 카테고리를 제공한다. 오디오 인프라는 `utils/audio.ts`(MP3 재생 + TTS fallback)와 `hooks/useAudioPlayer.ts`(반복 재생 상태 관리)로 구성된다. `speakText()`는 고정 rate(0.8)로 TTS를 호출하며, `useAudioPlayer`는 MP3 파일 src를 입력으로 받는다.

기초 발음 기능은 음소 혼합(phoneme blending)을 위해 **속도가 가변적인 TTS 연속 재생**이 핵심이다. 기존 훅은 MP3 파일 기반이므로 TTS 전용 커스텀 로직이 필요하다.

## Goals / Non-Goals

**Goals:**
- 홈 화면에 '기초 발음' 카테고리 추가
- 기본 자음 14개(ㄱ~ㅎ) × 기본 모음 10개(ㅏ~ㅣ) 선택 UI 구현
- 자음 음가(예: ㄱ→'그') + 모음 소리를 3단계 가속으로 TTS 재생
- `speakText()`에 rate 파라미터 추가(기존 호출부 영향 없음)

**Non-Goals:**
- 쌍자음(ㄲ, ㄸ, ㅃ, ㅆ, ㅉ), 복합 모음(ㅘ, ㅙ 등)은 Phase 2
- 음절 이력 저장(글자 만들기의 '만든 글자' 목록) 미포함
- 사전 녹음 MP3 파일 추가 없음 — TTS 전용 기능

## Decisions

### 1. 음가 매핑: `hangul.ts`에 상수 추가

`src/utils/hangul.ts`에 `CONSONANT_PHONEMES` Record 추가.
모음은 ㅇ+모음 조합 음절로 매핑(`VOWEL_PHONEMES`).

```
CONSONANT_PHONEMES: { ㄱ: '그', ㄴ: '느', ㄷ: '드', ㄹ: '르', ㅁ: '므', ㅂ: '브',
                      ㅅ: '스', ㅇ: '으', ㅈ: '즈', ㅊ: '츠', ㅋ: '크', ㅌ: '트',
                      ㅍ: '프', ㅎ: '흐' }
VOWEL_PHONEMES:     { ㅏ: '아', ㅑ: '야', ㅓ: '어', ㅕ: '여', ㅗ: '오', ㅛ: '요',
                      ㅜ: '우', ㅠ: '유', ㅡ: '으', ㅣ: '이' }
```

**대안 고려**: 모음을 자모 문자 그대로 TTS에 넘기는 방안 — 브라우저별로 ㅏ를 '아'로 읽지 않을 수 있어 명시적 매핑이 안전.

### 2. TTS rate 가변화: `speakText()` 시그니처 확장

```ts
// 기존
export function speakText(text: string, lang = 'ko-KR'): Promise<void>
// 변경 — rate 기본값 0.8 유지로 기존 호출부 무변경
export function speakText(text: string, lang = 'ko-KR', rate = 0.8): Promise<void>
```

**대안 고려**: 별도 `speakTextAtRate()` 추가 — 함수가 늘어나고 동일 로직 중복 발생.

### 3. 블렌딩 시퀀스: 인라인 로직 (새 훅 미도입)

3단계 재생 시퀀스는 단순 async 함수 `playBlendingSequence()`로 구현하고 컴포넌트 내 `useCallback`으로 감싼다. 별도 훅 추출 없이도 상태 관리가 단순하다.

| 단계 | 재생 내용 | rate | 단계 간 간격 |
|------|-----------|------|-------------|
| 1    | 자음 음가 → (pause 400ms) → 모음 소리 | 0.6 | 1200ms |
| 2    | 자음 음가 + 모음 결합 텍스트 | 0.9 | 800ms  |
| 3    | 자음 음가 + 모음 결합 텍스트 | 1.4 | —      |

단계 1에서 두 소리를 분리 재생하고, 단계 2·3에서 합쳐진 텍스트를 빠르게 재생하여 합성음이 느껴지도록 한다.

**대안 고려**: 단계 3에서 완성 음절(예: '가')을 TTS에 넘기는 방안 — '그아' 빠르게와 '가'는 TTS 발음이 다를 수 있어 동일 텍스트 가속이 더 자연스럽다.

### 4. 컴포넌트 구조: 단일 페이지

글자 만들기(`LetterBuilderModes` → `LetterBuilderBasic`)와 달리 하위 모드 없이 단일 컴포넌트 `BasicPronunciation.tsx`.
`src/components/basic-pronunciation/BasicPronunciation.tsx`

### 5. 자동 재생: 양쪽 선택 시 즉시 시작

자음과 모음이 모두 선택된 순간 `useEffect`로 `playBlendingSequence` 자동 호출. 재생 중 다른 카드 선택 시 현재 재생 취소 후 새 시퀀스 시작. '재생 중' UI 상태(loading indicator)로 피드백 제공.

**대안 고려**: 명시적 '발음 듣기' 버튼 — 터치 한 번을 줄여 자동 재생이 더 직관적. iOS Safari의 autoplay 제한은 사용자가 카드를 탭하는 제스처로 이미 충족됨.

## Risks / Trade-offs

- **iOS Web Speech API 지원**: iOS 14.5+부터 안정적. 구형 기기에서 오류 시 silent fail(재생 없음)로 처리. → 재생 실패 시 UI에 경고 미표시(현재 앱 정책 동일)
- **rate 1.4에서의 발음 왜곡**: 너무 빠르면 TTS 음성이 부자연스러울 수 있음 → 실제 테스트 후 rate 값 조정 가능(스펙에 고정하지 않음)
- **Web Speech API 음질 한계**: 브라우저 TTS는 음성 엔진 품질이 기기·OS에 따라 편차가 크고, 음가 단독 발음('그', '느' 등)이 부자연스러울 수 있음. 음질이 교육 목적에 미달할 경우 다음 대안을 고려한다:
  - **rTTS 사전 생성**: 음가 문자열(예: '그', '아', '그아' 등) 조합 수는 유한하므로(자음 14 × 모음 10 × 3단계 ≈ 420개 이하) Google TTS / Naver Clova Voice / Kakao i Voice 등 고품질 API로 MP3를 사전 생성하여 `public/audio/phonemes/` 에 배치. 재생 시 MP3 우선, 실패 시 Web Speech API fallback (기존 `playSyllable()` 패턴과 동일).
  - **오픈소스 한국어 TTS**: [MMS-TTS](https://huggingface.co/facebook/mms-tts-kor), [KoSpeech](https://github.com/sooftware/kospeech) 등으로 로컬 생성 가능.
  - **음질 판단 기준**: 1단계 분리 발음에서 자음 음가가 명확히 구분되는지, 3단계에서 합성음이 자연스럽게 들리는지로 판단.
- **ㅇ 자음 처리**: 초성 ㅇ은 묵음이므로 음가가 '으'(또는 무음). 선택 가능하게 하되 음가를 '으'로 처리하면 ㅏ와 조합 시 '으'+'아' → '아'처럼 들림 — 교육적으로 적절.

## Migration Plan

1. `types.ts`에 `'basic-pronunciation'` 리터럴 추가
2. `hangul.ts`에 `CONSONANT_PHONEMES`, `VOWEL_PHONEMES` 추가
3. `audio.ts`의 `speakText()` rate 파라미터 추가
4. `BasicPronunciation.tsx` 컴포넌트 작성
5. `CategorySelection.tsx`에 버튼 추가
6. `routes.tsx`에 `/basic-pronunciation` 라우트 추가

롤백: 카테고리 버튼 제거 및 라우트 삭제만으로 완전 롤백 가능. 공유 유틸 변경(hangul.ts, audio.ts)은 additive-only로 기존 동작 영향 없음.

## Open Questions

- ㅇ을 자음 목록에 포함할지 여부 (초성 ㅇ은 묵음이라 발음 학습 의미가 약함)
- 3단계 완료 후 시각적 피드백(예: 완성 음절 표시) 제공 여부
