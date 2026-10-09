// Written by scripts/brag-timing.ts from the voice's lengths; edit brag/narration.json instead.
window.TIMING = {
  "duration": 85.244,
  "scenes": {
    "hook": {
      "enter": 0,
      "start": 0.6,
      "end": 6.968
    },
    "run": {
      "enter": 7.118,
      "start": 7.868,
      "end": 11.204
    },
    "questions": {
      "enter": 11.354,
      "start": 12.104,
      "end": 31.6
    },
    "pain": {
      "enter": 31.75,
      "start": 32.5,
      "end": 38.028
    },
    "veridelta": {
      "enter": 39.278,
      "start": 40.028,
      "end": 45.868
    },
    "suggest": {
      "enter": 46.418,
      "start": 47.168,
      "end": 58.848
    },
    "baseline": {
      "enter": 59.398,
      "start": 60.148,
      "end": 64.396
    },
    "left": {
      "enter": 64.546,
      "start": 65.296,
      "end": 73.16
    },
    "pass": {
      "enter": 73.61,
      "start": 74.36,
      "end": 77.024
    },
    "end": {
      "enter": 77.174,
      "start": 77.924,
      "end": 81.044
    }
  },
  "lines": {
    "hook": {
      "text": "Maya is moving her weather station pipeline from IDL to Python.",
      "start": 0.6,
      "end": 3.984
    },
    "parity": {
      "text": "The new output has to match the old. One to one.",
      "start": 4.184,
      "end": 6.968
    },
    "run": {
      "text": "She runs both and compares. Every single row differs.",
      "start": 7.868,
      "end": 11.204
    },
    "floats": {
      "text": "IDL works in 32-bit floats. Python works in 64.",
      "start": 12.104,
      "end": 15.416
    },
    "noise": {
      "text": "So the same humidity comes out two ways.",
      "start": 15.616,
      "end": 17.368
    },
    "fill": {
      "text": "IDL wrote minus 999 for a missing reading. Python writes nothing.",
      "start": 17.568,
      "end": 21.408
    },
    "rename": {
      "text": "She renamed temp to temperature_c, so a match by name quietly leaves it out.",
      "start": 21.608,
      "end": 25.976
    },
    "fix": {
      "text": "And she fixed a real IDL bug. Station S3 had the wrong elevation, so its pressure changed on purpose.",
      "start": 26.176,
      "end": 31.6
    },
    "doubt": {
      "text": "Somewhere in all of that, the port has a bug of its own.",
      "start": 32.5,
      "end": 35.236
    },
    "question": {
      "text": "Which differences are fixes, and which are corruption?",
      "start": 35.436,
      "end": 38.028
    },
    "reveal": {
      "text": "Veridelta compares two datasets on their keys, under rules you declare.",
      "start": 40.028,
      "end": 43.7
    },
    "forgiven": {
      "text": "Nothing is forgiven unless a rule says so.",
      "start": 43.9,
      "end": 45.868
    },
    "declare": {
      "text": "Maya declares the rename. Then veridelta suggest reads the data and proposes the rest.",
      "start": 47.168,
      "end": 51.632
    },
    "evidence": {
      "text": "One rule for humidity: a tiny tolerance, and minus 999 as missing. It explains all 124 rows.",
      "start": 51.832,
      "end": 57.712
    },
    "model": {
      "text": "No model is called.",
      "start": 57.912,
      "end": 58.848
    },
    "baseline": {
      "text": "The pressure fix was on purpose, so a baseline accepts those 31 rows. Only those.",
      "start": 60.148,
      "end": 64.396
    },
    "left": {
      "text": "What's left is the real bug. Four cold readings lost their minus sign.",
      "start": 65.296,
      "end": 68.848
    },
    "allalong": {
      "text": "They were in the first rows all along.",
      "start": 69.048,
      "end": 70.344
    },
    "fails": {
      "text": "The run fails, and in CI, so does the pull request.",
      "start": 70.544,
      "end": 73.16
    },
    "passes": {
      "text": "She fixes the port. It passes. One to one.",
      "start": 74.36,
      "end": 77.024
    },
    "end": {
      "text": "Veridelta. Compare two datasets under rules you declare.",
      "start": 77.924,
      "end": 81.044
    }
  }
};
