## 1. 타입 및 데이터 준비

- [x] 1.1 `src/types.ts` — `LearningCategory` 유니온 타입에 `'basic-pronunciation'` 추가
- [x] 1.2 `src/utils/hangul.ts` — `CONSONANT_PHONEMES` Record 추가 (기본 자음 14개 음가 매핑: ㄱ→'그', ㄴ→'느' 등)
- [x] 1.3 `src/utils/hangul.ts` — `VOWEL_PHONEMES` Record 추가 (기본 모음 10개 소리 매핑: ㅏ→'아', ㅗ→'오' 등)

## 2. 오디오 유틸리티 수정

- [x] 2.1 `src/utils/audio.ts` — `speakText(text, lang, rate?)` 시그니처 변경, `rate` 기본값 0.8 유지 (기존 호출부 무변경)

## 3. 기초 발음 컴포넌트 구현

- [x] 3.1 `src/components/basic-pronunciation/BasicPronunciation.tsx` 파일 생성
- [x] 3.2 자음 14개(`CONSONANTS_BASIC`) · 모음 10개(`VOWELS_BASIC`) 카드 그리드 UI 구현
- [x] 3.3 `selectedCho` / `selectedJung` 선택 상태 관리 및 선택 카드 강조 표시 구현
- [x] 3.4 `playBlendingSequence` 구현 — 1단계(분리 재생, rate 0.6, 400ms 간격) → 1200ms 대기 → 2단계(결합 텍스트, rate 0.9) → 800ms 대기 → 3단계(결합 텍스트, rate 1.4)
- [x] 3.5 `useEffect`로 두 자모 모두 선택 시 `playBlendingSequence` 자동 호출, 이전 재생 취소(cancel ref) 처리
- [x] 3.6 재생 중 `isPlaying` 상태에 따른 UI 인디케이터 표시

## 4. 라우팅 및 홈 화면 연동

- [x] 4.1 `src/routes.tsx` — `BasicPronunciation` import 및 `/basic-pronunciation` Route 추가
- [x] 4.2 `src/components/CategorySelection.tsx` — `categories` 배열에 '기초 발음' 항목 추가
- [x] 4.3 `src/components/CategorySelection.tsx` — `handleSelect` 분기에 `'basic-pronunciation'` → `/basic-pronunciation` 이동 처리 추가

## 5. 음질 확인 및 오디오 파일 대응

- [ ] 5.1 실기기(iOS/Android)에서 Web Speech API TTS 음질 확인 — 자음 음가 분리 발음 명확성 및 3단계 합성 효과 검증
- [ ] 5.2 음질 미달 시: Google TTS / Clova Voice 등으로 음가 조합 MP3 사전 생성 스크립트 작성, `public/audio/phonemes/` 배치
- [ ] 5.3 음질 미달 시: `playBlendingSequence` 내 MP3 우선 재생 → 실패 시 TTS fallback 처리 추가
