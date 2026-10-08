// Reads a transcript of one of Veridelta's tapes: each line the prompt starts is a command,
// and the lines after it, up to the next, are what the terminal showed.

/** One command a tape typed, and what the terminal showed after it, line by line. */
export type Step = { command: string; output: string[] };

/** The prompt vhs shows before each command, as Veridelta's tape test writes it. */
export const PROMPT = "> ";

/** Split a transcript into its commands and their output, keeping every line as written. */
export const parseTranscript = (text: string): Step[] => {
  const lines = text.split("\n");
  // A transcript ends in a newline, which leaves one empty string after the split.
  if (lines[lines.length - 1] === "") {
    lines.pop();
  }
  const steps: Step[] = [];
  for (const line of lines) {
    if (line.startsWith(PROMPT)) {
      steps.push({ command: line.slice(PROMPT.length), output: [] });
    } else if (steps.length === 0) {
      throw new Error(`A transcript must start with a command, not "${line}".`);
    } else {
      steps[steps.length - 1].output.push(line);
    }
  }
  return steps;
};
