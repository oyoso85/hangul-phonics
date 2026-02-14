/**
 * Google TTS를 사용하여 한글 음절 MP3 파일 생성 (발음 정규화 적용)
 *
 * 사용법:
 *   node scripts/generate-syllable-audio.mjs
 *
 * 생성 구조:
 *   public/audio/syllables/  - 조합된 음절 (가.mp3, 간.mp3, ...)
 *
 * 발음 최적화:
 *   - 받침 대표음: ㄱ,ㄲ,ㅋ→[ㄱ] / ㄷ,ㅅ,ㅆ,ㅈ,ㅊ,ㅌ,ㅎ→[ㄷ] / ㅂ,ㅍ→[ㅂ]
 *   - 모음 병합: ㅐ≈ㅔ, ㅒ≈ㅖ, ㅙ≈ㅚ≈ㅞ
 *   - 총 약 2,584개: 19초성 × 17대표모음 × (7대표받침 + 없음1)
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const AUDIO_DIR = resolve(ROOT, 'public', 'audio', 'syllables');

// 초성 (19개 유니코드 순서)
const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

// 중성 (21개 유니코드 순서)
const JUNGSEONG = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
];

// 종성 (28개 유니코드 순서, 0 = 없음)
const JONGSEONG = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

// 전체 초성 19개
const ALL_CHO = CHOSEONG;

// 대표 모음 17개 (ㅐ→ㅔ, ㅒ→ㅖ, ㅙ/ㅚ→ㅞ 병합)
const REPRESENTATIVE_VOWELS = [
  'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ',
  'ㅔ', 'ㅖ', 'ㅘ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ',
];

// 대표 받침 7개
const REPRESENTATIVE_BATCHIM = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅇ'];

function composeHangul(cho, jung, jong) {
  const choIdx = CHOSEONG.indexOf(cho);
  const jungIdx = JUNGSEONG.indexOf(jung);
  const jongIdx = jong ? JONGSEONG.indexOf(jong) : 0;
  if (choIdx === -1 || jungIdx === -1 || jongIdx === -1) return null;
  return String.fromCharCode(0xac00 + choIdx * 21 * 28 + jungIdx * 28 + jongIdx);
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function downloadTTS(text, outputPath) {
  return new Promise((resolvePromise, reject) => {
    if (existsSync(outputPath)) {
      resolvePromise('skip');
      return;
    }

    const encodedText = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ko&q=${encodedText}`;

    const doRequest = (requestUrl) => {
      https.get(requestUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          doRequest(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for "${text}"`));
          return;
        }
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          writeFileSync(outputPath, Buffer.concat(chunks));
          resolvePromise('done');
        });
        res.on('error', reject);
      }).on('error', reject);
    };

    doRequest(url);
  });
}

async function main() {
  ensureDir(AUDIO_DIR);

  // 대표 발음 음절만 생성
  const syllables = [];
  for (const cho of ALL_CHO) {
    for (const jung of REPRESENTATIVE_VOWELS) {
      // 받침 없음
      syllables.push(composeHangul(cho, jung, null));
      // 대표 받침만
      for (const jong of REPRESENTATIVE_BATCHIM) {
        syllables.push(composeHangul(cho, jung, jong));
      }
    }
  }

  const valid = syllables.filter(Boolean);
  const total = valid.length;
  console.log(`총 ${total}개 대표 발음 음절 생성 시작...`);
  console.log(`  초성: ${ALL_CHO.length}개, 대표모음: ${REPRESENTATIVE_VOWELS.length}개, 대표받침: ${REPRESENTATIVE_BATCHIM.length}개 + 없음`);
  console.log(`  발음 최적화: 받침 16→7, 모음 21→17`);
  console.log(`출력 경로: ${AUDIO_DIR}\n`);

  let done = 0;
  let skipped = 0;
  let errors = 0;

  for (const syllable of valid) {
    const filePath = resolve(AUDIO_DIR, `${syllable}.mp3`);
    try {
      const result = await downloadTTS(syllable, filePath);
      if (result === 'skip') {
        skipped++;
      } else {
        done++;
      }

      const current = done + skipped + errors;
      if (current % 50 === 0 || current === total) {
        console.log(`  진행: ${current}/${total} (생성: ${done}, 건너뜀: ${skipped}, 오류: ${errors})`);
      }

      // Rate limiting: 300ms delay between requests
      if (result !== 'skip') {
        await sleep(300);
      }
    } catch (err) {
      errors++;
      console.error(`  [error] ${syllable}: ${err.message}`);
      await sleep(1000);
    }
  }

  console.log(`\n완료! 총 ${done + skipped}개 파일 (신규: ${done}, 기존: ${skipped}, 오류: ${errors})`);
}

main().catch(console.error);
