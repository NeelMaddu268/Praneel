// ============================================================================
//  FORZA CODE VAULT — GAME CONFIGURATION
//  Edit this file to tweak questions, answers, hints, or the prize code.
// ============================================================================

// The 25-character prize code, split into its 5 segments.
// Segment N unlocks when question N is answered correctly.
export const CODE_SEGMENTS = ["X9GKV", "G6GQY", "C9RTP", "W6HJT", "J6FFZ"];

// ----------------------------------------------------------------------------
//  QUESTION 2 — VISUAL CAR IDENTIFICATION
// ----------------------------------------------------------------------------
// >>> REPLACE THIS URL with your Imgur/Discord image link (zoomed-in car detail).
export const CAR_IMAGE_URL = "[INSERT YOUR IMGUR/DISCORD IMAGE LINK HERE]";

// >>> UPDATE these to match the car in YOUR image. Validation is forgiving:
// capitalization, punctuation, and extra spacing are ignored, and any answer
// that *contains* one of these phrases also counts (e.g. "the toyota supra mk4").
export const CAR_ACCEPTED_ANSWERS = [
  "toyota supra",
  "supra",
  "supra mk4",
  "mk4 supra",
  "toyota supra mk4",
];

export const CAR_HINT =
  "A Japanese legend of the 1990s — its 2JZ engine is the stuff of tuner folklore.";

// ----------------------------------------------------------------------------
//  QUESTION TYPES
// ----------------------------------------------------------------------------
export type MultipleChoiceQuestion = {
  kind: "multiple-choice";
  category: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  hint: string;
};

export type TextQuestion = {
  kind: "text";
  category: string;
  prompt: string;
  acceptedAnswers: string[]; // forgiving match — see normalizeAnswer()
  hint: string | null;
  imageUrl?: string;
  placeholder: string;
  // Fake-out mode: dramatic one-chance warning UI, but ANY non-empty answer wins.
  fakeOut?: boolean;
};

export type Question = MultipleChoiceQuestion | TextQuestion;

// ----------------------------------------------------------------------------
//  THE 5 QUESTIONS
// ----------------------------------------------------------------------------
export const QUESTIONS: Question[] = [
  // Q1 — F1 TRIVIA (multiple choice)
  {
    kind: "multiple-choice",
    category: "FORMULA 1",
    prompt:
      "Michael Schumacher and Lewis Hamilton are tied at the top with 7 world titles each. Who sits THIRD on the all-time championship list with 5?",
    options: [
      "Alain Prost",
      "Juan Manuel Fangio",
      "Sebastian Vettel",
      "Ayrton Senna",
    ],
    correctIndex: 1,
    hint: "He dominated the 1950s — and won his titles driving for four different teams.",
  },

  // Q2 — VISUAL CAR ID (text input, forgiving validation)
  {
    kind: "text",
    category: "CAR SPOTTER",
    prompt: "Identify the exact make and model from this zoomed-in detail.",
    acceptedAnswers: CAR_ACCEPTED_ANSWERS,
    hint: CAR_HINT,
    imageUrl: CAR_IMAGE_URL,
    placeholder: "e.g. Ferrari F40",
  },

  // Q3 — UGA TRIVIA (multiple choice)
  {
    kind: "multiple-choice",
    category: "UGA BULLDOGS",
    prompt:
      "The Georgia Bulldogs went back-to-back, winning College Football Playoff National Championships in which two seasons?",
    options: [
      "2019 & 2020",
      "2020 & 2021",
      "2021 & 2022",
      "2022 & 2023",
    ],
    correctIndex: 2,
    hint: "Stetson Bennett — the walk-on turned legend — was the quarterback for both runs.",
  },

  // Q4 — NBA TRIVIA (multiple choice)
  {
    kind: "multiple-choice",
    category: "NBA FINALS",
    prompt:
      "Game 7, 2016 NBA Finals: LeBron James delivers 'The Block' — an iconic chase-down rejection. Which Warrior did he stuff?",
    options: [
      "Stephen Curry",
      "Klay Thompson",
      "Harrison Barnes",
      "Andre Iguodala",
    ],
    correctIndex: 3,
    hint: "The 2015 Finals MVP — a defensive specialist, not a Splash Brother.",
  },

  // Q5 — THE FINAL GAUNTLET (fake-out: any non-empty answer is correct)
  {
    kind: "text",
    category: "FINAL GAUNTLET",
    prompt: "What is your favorite drink at Cloud?",
    acceptedAnswers: [],
    hint: null,
    placeholder: "Type your answer… carefully.",
    fakeOut: true,
  },
];

// ----------------------------------------------------------------------------
//  FORGIVING TEXT VALIDATION
// ----------------------------------------------------------------------------
// Lowercases, strips punctuation, and collapses whitespace so "ToYoTa  SuPrA!"
// matches "toyota supra".
export function normalizeAnswer(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isTextAnswerCorrect(raw: string, question: TextQuestion): boolean {
  const input = normalizeAnswer(raw);
  if (input.length === 0) return false;
  if (question.fakeOut) return true; // the fake-out: everything is the one true answer
  return question.acceptedAnswers.some((accepted) => {
    const target = normalizeAnswer(accepted);
    return input === target || input.includes(target);
  });
}
