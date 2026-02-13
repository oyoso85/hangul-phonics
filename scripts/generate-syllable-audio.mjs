/**
 * Google TTS를 사용하여 한글 음절 MP3 파일 생성
 *
 * 사용법:
 *   node scripts/generate-syllable-audio.mjs
 *
 * 생성 구조:
 *   public/audio/syllables/  - 조합된 음절 (가.mp3, 간.mp3, ...)
 *
 * 총 2,100개: 14자음 × 10모음 × 15(받침14 + 없음1)
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

// 앱에서 사용하는 기본 자음 14개
const BASIC_CONSONANTS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 앱에서 사용하는 기본 모음 10개
const BASIC_VOWELS = ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];

// 받침으로 사용하는 자음 14개
const BATCHIM = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

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

  // 모든 음절 조합 생성
  const syllables = [];
  for (const cho of BASIC_CONSONANTS) {
    for (const jung of BASIC_VOWELS) {
      // 받침 없음
      syllables.push(composeHangul(cho, jung, null));
      // 받침 있음
      for (const jong of BATCHIM) {
        syllables.push(composeHangul(cho, jung, jong));
      }
    }
  }

  const total = syllables.length;
  console.log(`총 ${total}개 음절 생성 시작...`);
  console.log(`출력 경로: ${AUDIO_DIR}\n`);

  let done = 0;
  let skipped = 0;
  let errors = 0;

  for (const syllable of syllables) {
    if (!syllable) continue;

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
      // On error, wait longer and continue
      await sleep(1000);
    }
  }

  console.log(`\n완료! 총 ${done + skipped}개 파일 (신규: ${done}, 기존: ${skipped}, 오류: ${errors})`);
}

main().catch(console.error);
