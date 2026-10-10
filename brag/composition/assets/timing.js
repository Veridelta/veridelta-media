// Written by scripts/brag-timing.ts from the voice's lengths; edit brag/narration.json instead.
window.TIMING = {
  "duration": 90.58,
  "scenes": {
    "hook": {
      "enter": 0,
      "start": 0.6,
      "end": 7.4
    },
    "run": {
      "enter": 7.55,
      "start": 8.3,
      "end": 11.876
    },
    "questions": {
      "enter": 12.026,
      "start": 12.776,
      "end": 33.52
    },
    "pain": {
      "enter": 33.67,
      "start": 34.42,
      "end": 40.308
    },
    "veridelta": {
      "enter": 42.358,
      "start": 43.108,
      "end": 49.308
    },
    "suggest": {
      "enter": 49.858,
      "start": 50.608,
      "end": 63.032
    },
    "baseline": {
      "enter": 63.582,
      "start": 64.332,
      "end": 68.868
    },
    "left": {
      "enter": 69.018,
      "start": 69.768,
      "end": 78.136
    },
    "pass": {
      "enter": 78.586,
      "start": 79.336,
      "end": 82.168
    },
    "end": {
      "enter": 82.318,
      "start": 83.068,
      "end": 86.38
    }
  },
  "lines": {
    "hook": {
      "text": "Maya is moving her weather station pipeline from IDL to Python.",
      "start": 0.6,
      "end": 4.224
    },
    "parity": {
      "text": "The new output has to match the old. One to one.",
      "start": 4.424,
      "end": 7.4
    },
    "run": {
      "text": "She runs both and compares. Every single row differs.",
      "start": 8.3,
      "end": 11.876
    },
    "floats": {
      "text": "IDL works in 32-bit floats. Python works in 64.",
      "start": 12.776,
      "end": 16.304
    },
    "noise": {
      "text": "So the same humidity comes out two ways.",
      "start": 16.504,
      "end": 18.376
    },
    "fill": {
      "text": "IDL wrote minus 999 for a missing reading. Python writes nothing.",
      "start": 18.576,
      "end": 22.68
    },
    "rename": {
      "text": "She renamed temp to temperature_c, so a match by name quietly leaves it out.",
      "start": 22.88,
      "end": 27.536
    },
    "fix": {
      "text": "And she fixed a real IDL bug. Station S3 had the wrong elevation, so its pressure changed on purpose.",
      "start": 27.736,
      "end": 33.52
    },
    "doubt": {
      "text": "Somewhere in all of that, the port has a bug of its own.",
      "start": 34.42,
      "end": 37.348
    },
    "question": {
      "text": "Which differences are fixes, and which are corruption?",
      "start": 37.548,
      "end": 40.308
    },
    "reveal": {
      "text": "Veridelta compares two datasets on their keys, under rules you declare.",
      "start": 43.108,
      "end": 47.02
    },
    "forgiven": {
      "text": "Nothing is forgiven unless a rule says so.",
      "start": 47.22,
      "end": 49.308
    },
    "declare": {
      "text": "Maya declares the rename. Then veridelta suggest reads the data and proposes the rest.",
      "start": 50.608,
      "end": 55.384
    },
    "evidence": {
      "text": "One rule for humidity: a tiny tolerance, and minus 999 as missing. It explains all 124 rows.",
      "start": 55.584,
      "end": 61.872
    },
    "model": {
      "text": "No model is called.",
      "start": 62.072,
      "end": 63.032
    },
    "baseline": {
      "text": "The pressure fix was on purpose, so a baseline accepts those 31 rows. Only those.",
      "start": 64.332,
      "end": 68.868
    },
    "left": {
      "text": "What's left is the real bug. Four cold readings lost their minus sign.",
      "start": 69.768,
      "end": 73.584
    },
    "allalong": {
      "text": "They were in the first rows all along.",
      "start": 73.784,
      "end": 75.152
    },
    "fails": {
      "text": "The run fails, and in CI, so does the pull request.",
      "start": 75.352,
      "end": 78.136
    },
    "passes": {
      "text": "She fixes the port. It passes. One to one.",
      "start": 79.336,
      "end": 82.168
    },
    "end": {
      "text": "Veridelta. Compare two datasets under rules you declare.",
      "start": 83.068,
      "end": 86.38
    }
  }
};
