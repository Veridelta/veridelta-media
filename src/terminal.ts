// The pace and the size of a terminal set in type, which the storyboard times its beats by
// and the check measures each transcript against.

/** Characters typed per second, near a person typing a command they know. */
export const TYPING = 32;
/** Seconds from the last character typed to the output, as Enter runs the command. */
export const ENTER = 0.35;
/** Rows the terminal shows before the oldest scroll off the top. */
export const ROWS = 20;
/** The widest line, in characters, the terminal shows without cutting it. */
export const COLUMNS = 92;

/** Seconds from a command's first character to its output. */
export const runSeconds = (command: string) => command.length / TYPING + ENTER;

export type TerminalTiming = {
  /** When each command starts to type, in seconds from the start of the scene. */
  starts: number[];
  /** Lines to underline, each from the moment given, matched whole. */
  marks: { text: string; at: number }[];
};
