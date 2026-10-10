"""Find where each line of a script starts and ends in one spoken take.

scripts/voice.ts runs this on the take Gemini speaks for a whole cut, so it can cut the take
into one clip per line. Whisper, run here on the CPU, hears the take in pieces of at most
CHUNK seconds, cut at its silences, since it skips words in one long piece. Its words are
matched to the script's words in order, and each line gets the time its first matched word
starts and its last ends, with the share of its words that were heard.

Usage, as scripts/voice.ts runs it:
    uvx --from faster-whisper==1.2.1 python scripts/align.py <take.wav> <lines.json>

It prints a JSON list, one entry a line: {"start": s, "end": e, "heard": share}.

With --words, it hears clips that are already cut, one line each, and times every word of
each line the same way, so an animation can land on the word it shows:
    uvx --from faster-whisper==1.2.1 python scripts/align.py --words <clips.json>

clips.json lists {"audio": path, "text": line}. It prints a JSON list, one entry a clip, of
{"word": word, "start": s, "end": e} for each word of the line, with null times for a word
Whisper did not hear.
"""

import difflib
import json
import re
import subprocess
import sys

import numpy as np
from faster_whisper import WhisperModel

RATE = 16000
CHUNK = 25.0
"""The longest piece of the take, in seconds, that Whisper hears at once."""
SILENCE = 0.5
"""The shortest silence, in seconds, a piece may end in."""
NUMBERS = {"0": "zero", "1": "one", "7": "seven", "17": "seventeen", "39": "thirtynine", "40": "forty"}
"""Numerals the script writes as digits and Whisper may write as words."""


def samples(wav: str) -> np.ndarray:
    """Read a WAV file as 16 kHz mono samples between -1 and 1."""
    pcm = subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-i", wav, "-ar", str(RATE), "-ac", "1", "-f", "s16le", "-"],
        capture_output=True,
        check=True,
    ).stdout
    return np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768


def silences(wav: str) -> list[float]:
    """Return the middle of every silence of at least SILENCE seconds, in order."""
    log = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", wav, "-af", f"silencedetect=noise=-38dB:d={SILENCE}", "-f", "null", "-"],
        capture_output=True,
        text=True,
        check=True,
    ).stderr
    starts = [float(value) for value in re.findall(r"silence_start: ([\d.]+)", log)]
    ends = [float(value) for value in re.findall(r"silence_end: ([\d.]+)", log)]
    return [(start + end) / 2 for start, end in zip(starts, ends, strict=False)]


def pieces(total: float, quiet: list[float]) -> list[tuple[float, float]]:
    """Cut the take at silences into pieces no longer than CHUNK seconds, where it can."""
    bounds = [0.0]
    for index, middle in enumerate(quiet):
        following = quiet[index + 1] if index + 1 < len(quiet) else total
        if following - bounds[-1] > CHUNK and middle > bounds[-1]:
            bounds.append(middle)
    return list(zip(bounds, [*bounds[1:], total], strict=True))


def heard(wav: str) -> list[dict]:
    """Return every word Whisper hears in the take, with its start and end in seconds."""
    audio = samples(wav)
    model = WhisperModel("base.en", device="cpu", compute_type="int8")
    words = []
    for start, end in pieces(len(audio) / RATE, silences(wav)):
        piece = audio[int(start * RATE) : int(end * RATE)]
        segments, _ = model.transcribe(piece, word_timestamps=True, beam_size=5, condition_on_previous_text=False)
        words += [
            {"word": word.word.strip(), "start": start + word.start, "end": start + word.end}
            for segment in segments
            for word in segment.words
        ]
    return words


def plain(token: str) -> str:
    """Lower a word to its letters and digits, and spell the numerals the script uses."""
    token = re.sub(r"[^a-z0-9]", "", token.lower())
    return NUMBERS.get(token, token)


def match(tokens: list[str], words: list[dict]) -> dict[int, int]:
    """Match the script's tokens to the words Whisper heard, in order: token index to word index."""
    matcher = difflib.SequenceMatcher(a=tokens, b=[plain(word["word"]) for word in words], autojunk=False)
    matched = {}
    for block in matcher.get_matching_blocks():
        for offset in range(block.size):
            matched[block.a + offset] = block.b + offset
    return matched


def letters(tokens: list[str]) -> tuple[str, list[int]]:
    """Join tokens' plain letters into one string, with the token each letter came from."""
    text, owner = "", []
    for index, token in enumerate(tokens):
        text += plain(token)
        owner += [index] * len(plain(token))
    return text, owner


def times(clips: str) -> None:
    """Print the start and end of every word of each clip's line, as JSON.

    A clip's words are matched letter by letter, not word by word, so a word Whisper splits or
    joins, such as "datasets" heard as "data sets", still gets its time.
    """
    entries = json.loads(open(clips, encoding="utf-8").read())
    timed = []
    for entry in entries:
        words = heard(entry["audio"])
        script = [token for token in entry["text"].split() if plain(token)]
        said, said_owner = letters(script)
        spoken, spoken_owner = letters([word["word"] for word in words])
        matcher = difflib.SequenceMatcher(a=said, b=spoken, autojunk=False)
        found: dict[int, list[int]] = {}
        for block in matcher.get_matching_blocks():
            for offset in range(block.size):
                found.setdefault(said_owner[block.a + offset], []).append(spoken_owner[block.b + offset])
        timed.append(
            [
                {
                    "word": token,
                    "start": round(words[min(found[index])]["start"], 3) if index in found else None,
                    "end": round(words[max(found[index])]["end"], 3) if index in found else None,
                }
                for index, token in enumerate(script)
            ]
        )
    print(json.dumps(timed))


def main() -> None:
    """Print each line's start, end, and share of words heard, as JSON."""
    if sys.argv[1] == "--words":
        times(sys.argv[2])
        return
    wav, script = sys.argv[1], sys.argv[2]
    lines = json.loads(open(script, encoding="utf-8").read())
    words = heard(wav)
    tokens = [(index, plain(token)) for index, line in enumerate(lines) for token in line.split() if plain(token)]
    matched = match([token for _, token in tokens], words)
    spans = []
    for index in range(len(lines)):
        own = [position for position, (line, _) in enumerate(tokens) if line == index]
        found = [matched[position] for position in own if position in matched]
        spans.append(
            {
                "start": words[min(found)]["start"] if found else None,
                "end": words[max(found)]["end"] if found else None,
                "heard": round(len(found) / len(own), 3),
            }
        )
    print(json.dumps(spans))


if __name__ == "__main__":
    main()
