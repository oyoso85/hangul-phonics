## 1. 한글 조합 유틸리티

- [x] 1.1 `src/utils/hangul.ts` 생성 — 초성/중성/종성 인덱스 매핑 테이블 정의
- [x] 1.2 `composeHangul(초성, 중성, 종성?)` 함수 구현 (유니코드 공식)
- [x] 1.3 `src/utils/audio.ts`에 `speakText(text, lang)` TTS 함수 추가

## 2. 라우팅 및 놀이 메뉴

- [x] 2.1 `PlayTypes.tsx`에 '글자 만들기' 항목 추가 (`/play/letter-builder`로 이동)
- [x] 2.2 `routes.tsx`에 글자 만들기 관련 라우트 3개 등록 (`/play/letter-builder`, `/play/letter-builder/basic`, `/play/letter-builder/advanced`)

## 3. 모드 선택 화면

- [x] 3.1 `src/components/play/LetterBuilderModes.tsx` 생성 — 기본/받침 두 가지 모드 선택 UI

## 4. 기본 글자 만들기 (방식 1)

- [x] 4.1 `src/components/play/LetterBuilderBasic.tsx` 생성 — 왼쪽 자음(14개) + 오른쪽 모음(10개) 카드 레이아웃
- [x] 4.2 자음/모음 선택 상태 관리 및 선택 시 하이라이트 표시
- [x] 4.3 자음+모음 모두 선택 시 가운데 조합 글자 표시 + TTS 자동 재생
- [x] 4.4 완성 글자 히스토리 (최대 5개, 중복 시 맨 앞 이동, 탭 시 TTS 재생)

## 5. 받침 글자 만들기 (방식 2)

- [x] 5.1 `src/components/play/LetterBuilderAdvanced.tsx` 생성 — 방식 1 레이아웃 + 받침 선택 영역 추가
- [x] 5.2 받침 선택 영역 구현 (받침 가능 자음 + '없음' 옵션)
- [x] 5.3 초성+중성+종성 조합 글자 표시 + TTS 자동 재생
- [x] 5.4 완성 글자 히스토리 (방식 1과 동일 로직)

## 6. 동작 확인

- [x] 6.1 개발 서버에서 전체 플로우 확인 (놀이 → 글자 만들기 → 모드 선택 → 기본/받침 각 모드)
- [x] 6.2 TTS 재생 및 히스토리 동작 확인
