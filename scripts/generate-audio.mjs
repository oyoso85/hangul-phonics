/**
 * Google TTS를 사용하여 한글 파닉스 앱용 MP3 파일 생성 (Node.js)
 *
 * 사용법:
 *   node scripts/generate-audio.mjs
 *
 * 생성 구조:
 *   public/audio/
 *     jamo/         - 자음·모음 이름 (giyeok.mp3, a.mp3, ...)
 *     words/        - 자모 예시 단어 (giyeok.mp3, a.mp3, ...)
 *     vocabulary/   - 어휘 단어 (food/sagwa.mp3, ...)
 *     sentences/    - 문장 (greeting/0.mp3, ...)
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(ROOT, 'src', 'data');
const AUDIO_DIR = resolve(ROOT, 'public', 'audio');

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function downloadTTS(text, outputPath) {
  return new Promise((resolvePromise, reject) => {
    if (existsSync(outputPath)) {
      console.log(`  [skip] ${outputPath.replace(ROOT + '\\', '').replace(ROOT + '/', '')}`);
      resolvePromise();
      return;
    }

    const encodedText = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ko&q=${encodedText}`;

    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
          const chunks = [];
          res2.on('data', (chunk) => chunks.push(chunk));
          res2.on('end', () => {
            writeFileSync(outputPath, Buffer.concat(chunks));
            console.log(`  [done] ${outputPath.replace(ROOT + '\\', '').replace(ROOT + '/', '')}`);
            resolvePromise();
          });
          res2.on('error', reject);
        });
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
        console.log(`  [done] ${outputPath.replace(ROOT + '\\', '').replace(ROOT + '/', '')}`);
        resolvePromise();
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function generateJamoAudio() {
  console.log('\n=== 자모 음성 생성 ===');
  const jamoDir = resolve(AUDIO_DIR, 'jamo');
  const wordsDir = resolve(AUDIO_DIR, 'words');
  ensureDir(jamoDir);
  ensureDir(wordsDir);

  const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'jamo.json'), 'utf-8'));

  for (const group of ['consonants', 'vowels']) {
    for (const item of data[group]) {
      await downloadTTS(item.name, resolve(jamoDir, `${item.id}.mp3`));
      await sleep(300);
      await downloadTTS(item.exampleWord, resolve(wordsDir, `${item.id}.mp3`));
      await sleep(300);
    }
  }
}

async function generateVocabularyAudio() {
  console.log('\n=== 어휘 음성 생성 ===');
  const vocabDir = resolve(AUDIO_DIR, 'vocabulary');
  ensureDir(vocabDir);

  const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'vocabulary.json'), 'utf-8'));

  for (const [category, words] of Object.entries(data.categories)) {
    const catDir = resolve(vocabDir, category);
    ensureDir(catDir);
    for (const word of words) {
      await downloadTTS(word.spelling, resolve(catDir, `${word.id}.mp3`));
      await sleep(300);
    }
  }
}

async function generateSentenceAudio() {
  console.log('\n=== 문장 음성 생성 ===');
  const sentDir = resolve(AUDIO_DIR, 'sentences');
  ensureDir(sentDir);

  const data = JSON.parse(readFileSync(resolve(DATA_DIR, 'sentences.json'), 'utf-8'));

  for (const sentenceSet of data) {
    const setDir = resolve(sentDir, sentenceSet.id);
    ensureDir(setDir);
    for (let i = 0; i < sentenceSet.sentences.length; i++) {
      await downloadTTS(sentenceSet.sentences[i].text, resolve(setDir, `${i}.mp3`));
      await sleep(300);
    }
  }
}

async function main() {
  console.log(`프로젝트 루트: ${ROOT}`);
  console.log(`오디오 출력: ${AUDIO_DIR}`);
  ensureDir(AUDIO_DIR);

  await generateJamoAudio();
  await generateVocabularyAudio();
  await generateSentenceAudio();

  // Count generated files
  const { globSync } = await import('glob');
  const mp3Files = globSync('**/*.mp3', { cwd: AUDIO_DIR });
  console.log(`\n완료! 총 ${mp3Files.length}개 MP3 파일 생성됨`);
}

main().catch(console.error);
