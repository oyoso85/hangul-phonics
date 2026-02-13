"""
gTTS를 사용하여 한글 파닉스 앱용 MP3 파일 생성

사용법:
  pip install gtts
  python scripts/generate-audio.py

생성 구조:
  public/audio/
    jamo/         - 자음·모음 이름 (기역.mp3, 아.mp3, ...)
    vocabulary/   - 어휘 단어 (사과.mp3, 강아지.mp3, ...)
    sentences/    - 문장 (greeting-0.mp3, greeting-1.mp3, ...)
    words/        - 자모 예시 단어 (가방.mp3, 나비.mp3, ...)
"""

import json
import os
from pathlib import Path
from gtts import gTTS

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "src" / "data"
AUDIO_DIR = ROOT / "public" / "audio"


def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)


def generate_mp3(text: str, output_path: Path):
    if output_path.exists():
        print(f"  [skip] {output_path.relative_to(ROOT)}")
        return
    tts = gTTS(text=text, lang="ko", slow=False)
    tts.save(str(output_path))
    print(f"  [done] {output_path.relative_to(ROOT)}")


def generate_jamo_audio():
    """자음/모음 이름 + 예시 단어 음성 생성"""
    print("\n=== 자모 음성 생성 ===")
    jamo_dir = AUDIO_DIR / "jamo"
    words_dir = AUDIO_DIR / "words"
    ensure_dir(jamo_dir)
    ensure_dir(words_dir)

    with open(DATA_DIR / "jamo.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    for group in ["consonants", "vowels"]:
        for item in data[group]:
            jamo_id = item["id"]
            name = item["name"]
            example_word = item["exampleWord"]

            # 자모 이름 (기역, 니은, 아, 야, ...)
            generate_mp3(name, jamo_dir / f"{jamo_id}.mp3")

            # 예시 단어 (가방, 나비, 아기, ...)
            generate_mp3(example_word, words_dir / f"{jamo_id}.mp3")


def generate_vocabulary_audio():
    """어휘 단어 음성 생성"""
    print("\n=== 어휘 음성 생성 ===")
    vocab_dir = AUDIO_DIR / "vocabulary"
    ensure_dir(vocab_dir)

    with open(DATA_DIR / "vocabulary.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    for category, words in data["categories"].items():
        cat_dir = vocab_dir / category
        ensure_dir(cat_dir)
        for word in words:
            generate_mp3(word["spelling"], cat_dir / f"{word['id']}.mp3")


def generate_sentence_audio():
    """문장 음성 생성"""
    print("\n=== 문장 음성 생성 ===")
    sent_dir = AUDIO_DIR / "sentences"
    ensure_dir(sent_dir)

    with open(DATA_DIR / "sentences.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    for sentence_set in data:
        set_id = sentence_set["id"]
        set_dir = sent_dir / set_id
        ensure_dir(set_dir)
        for idx, sentence in enumerate(sentence_set["sentences"]):
            generate_mp3(sentence["text"], set_dir / f"{idx}.mp3")


def main():
    print(f"프로젝트 루트: {ROOT}")
    print(f"오디오 출력: {AUDIO_DIR}")
    ensure_dir(AUDIO_DIR)

    generate_jamo_audio()
    generate_vocabulary_audio()
    generate_sentence_audio()

    # 생성된 파일 수 집계
    mp3_files = list(AUDIO_DIR.rglob("*.mp3"))
    print(f"\n완료! 총 {len(mp3_files)}개 MP3 파일 생성됨")


if __name__ == "__main__":
    main()
