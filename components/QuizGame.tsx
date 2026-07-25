"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Copy,
  Flag,
  ImageOff,
  Lightbulb,
  Lock,
  ShieldAlert,
  Trophy,
  Unlock,
  Zap,
} from "lucide-react";
import {
  CODE_SEGMENTS,
  QUESTIONS,
  isTextAnswerCorrect,
  type Question,
} from "@/lib/quiz-config";

const REVEAL_DELAY_MS = 1900;

// ---------------------------------------------------------------------------
//  CODE VAULT DISPLAY
// ---------------------------------------------------------------------------
function CodeDisplay({
  unlockedCount,
  justRevealed,
}: {
  unlockedCount: number;
  justRevealed: number | null;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 sm:gap-x-2">
      {CODE_SEGMENTS.map((segment, i) => {
        const unlocked = i < unlockedCount;
        const isNew = i === justRevealed;
        return (
          <div key={i} className="flex items-center gap-x-1.5 sm:gap-x-2">
            <span
              className={`font-display inline-flex items-center gap-1 rounded-md border px-1.5 py-1.5 text-[13px] font-bold tracking-[0.14em] tabular-nums sm:px-2.5 sm:text-base ${
                unlocked
                  ? "border-neon-500/60 bg-neon-500/10 text-neon-400 [text-shadow:0_0_10px_rgba(0,217,255,0.75)]"
                  : "border-carbon-600 bg-carbon-850 text-carbon-400"
              } ${isNew ? "animate-seg-reveal" : ""}`}
            >
              {unlocked ? segment : "?????"}
            </span>
            {i < CODE_SEGMENTS.length - 1 && (
              <span
                className={`font-display text-sm font-bold sm:text-lg ${
                  unlocked ? "text-neon-500" : "text-carbon-400"
                }`}
              >
                -
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
//  PROGRESS LIGHTS (race-start gantry)
// ---------------------------------------------------------------------------
function ProgressLights({
  current,
  total,
  done,
}: {
  current: number;
  total: number;
  done: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: total }, (_, i) => {
        const cleared = done || i < current;
        const active = !done && i === current;
        return (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div
              className={`h-3.5 w-3.5 rounded-full border transition-all duration-500 sm:h-4 sm:w-4 ${
                cleared
                  ? "border-neon-400 bg-neon-500 shadow-[0_0_10px_rgba(0,217,255,0.8)]"
                  : active
                    ? "animate-light-pulse border-neon-500/70 bg-neon-500/30"
                    : "border-carbon-600 bg-carbon-800"
              }`}
            />
            <span
              className={`font-display text-[9px] tracking-widest ${
                cleared || active ? "text-neon-400/90" : "text-carbon-400"
              }`}
            >
              Q{i + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
//  QUESTION IMAGE (Q2) — graceful fallback if the URL isn't configured yet
// ---------------------------------------------------------------------------
function QuestionImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  const looksConfigured = /^https?:\/\//i.test(src);

  if (!looksConfigured || failed) {
    return (
      <div className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-carbon-600 bg-carbon-850 text-carbon-300 sm:h-52">
        <ImageOff className="h-8 w-8" aria-hidden="true" />
        <p className="font-display px-4 text-center text-[10px] tracking-[0.2em] uppercase">
          Image feed offline
        </p>
        <p className="px-6 text-center text-sm text-carbon-300">
          Set <code className="text-neon-400">CAR_IMAGE_URL</code> in{" "}
          <code className="text-neon-400">lib/quiz-config.ts</code>
        </p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Zoomed-in detail of a mystery car"
      onError={() => setFailed(true)}
      className="max-h-72 w-full rounded-lg border border-carbon-600 object-contain shadow-[0_0_24px_rgba(0,0,0,0.6)]"
    />
  );
}

// ---------------------------------------------------------------------------
//  VICTORY SCREEN
// ---------------------------------------------------------------------------
function VictoryScreen() {
  const fullCode = CODE_SEGMENTS.join("-");
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const copyCode = useCallback(async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(fullCode);
      ok = true;
    } catch {
      // Fallback for older/insecure contexts
      try {
        const ta = document.createElement("textarea");
        ta.value = fullCode;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2500);
    }
  }, [fullCode]);

  const sparks = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: `${(i * 137) % 100}%`,
        delay: `${((i * 53) % 40) / 10}s`,
        duration: `${2.4 + ((i * 31) % 22) / 10}s`,
        size: 2 + ((i * 7) % 3),
        red: i % 5 === 0,
      })),
    []
  );

  return (
    <div className="animate-slide-fade-in relative overflow-hidden rounded-2xl border border-neon-500/40 bg-carbon-900/80 p-6 shadow-[0_0_60px_rgba(0,217,255,0.15)] backdrop-blur-sm sm:p-10">
      {/* rising sparks */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {sparks.map((s, i) => (
          <span
            key={i}
            className="animate-spark absolute bottom-0 rounded-full"
            style={{
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
              animationDuration: s.duration,
              backgroundColor: s.red ? "#ff2743" : "#00d9ff",
              boxShadow: s.red
                ? "0 0 6px rgba(255,39,67,0.9)"
                : "0 0 6px rgba(0,217,255,0.9)",
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-5 text-center">
        <div className="flex items-center gap-3">
          <Flag className="h-7 w-7 text-neon-400" aria-hidden="true" />
          <Trophy
            className="h-12 w-12 text-hintamber-400 drop-shadow-[0_0_14px_rgba(255,176,32,0.6)]"
            aria-hidden="true"
          />
          <Flag className="h-7 w-7 text-neon-400 -scale-x-100" aria-hidden="true" />
        </div>

        <div>
          <h2 className="font-display animate-victory-glow text-2xl font-black tracking-[0.18em] text-neon-400 uppercase sm:text-4xl">
            Code Unlocked
          </h2>
          <p className="mt-2 text-base font-medium text-carbon-200 sm:text-lg">
            Checkered flag. All 5 segments decrypted — your Forza Horizon code
            is ready to redeem.
          </p>
        </div>

        <div className="w-full rounded-xl border border-neon-500/50 bg-carbon-950/80 px-3 py-5 shadow-[inset_0_0_30px_rgba(0,217,255,0.08)] sm:px-6">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Unlock className="h-4 w-4 text-neon-400" aria-hidden="true" />
            <span className="font-display text-[10px] tracking-[0.3em] text-neon-400/80 uppercase">
              25-character game code
            </span>
          </div>
          <CodeDisplay unlockedCount={CODE_SEGMENTS.length} justRevealed={null} />
        </div>

        <button
          type="button"
          onClick={copyCode}
          className={`font-display inline-flex cursor-pointer items-center gap-2.5 rounded-lg border px-6 py-3.5 text-sm font-bold tracking-[0.18em] uppercase transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-400 ${
            copied
              ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-300"
              : "border-neon-500/70 bg-neon-500/10 text-neon-400 hover:bg-neon-500/20 hover:shadow-[0_0_24px_rgba(0,217,255,0.35)] active:scale-[0.98]"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" /> Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" aria-hidden="true" /> Copy to Clipboard
            </>
          )}
        </button>

        <p className="text-sm text-carbon-300">
          Redeem it in the Microsoft Store and floor it. See you on the open
          road. 🏁
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  MAIN GAME
// ---------------------------------------------------------------------------
export default function QuizGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<"question" | "revealing" | "victory">(
    "question"
  );
  const [justRevealed, setJustRevealed] = useState<number | null>(null);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textValue, setTextValue] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  // After advancing, move keyboard focus to the new question's prompt so
  // keyboard/screen-reader users land on the next question instead of <body>
  // (the previously focused submit button gets disabled during the reveal).
  const promptRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    if (questionIndex > 0) promptRef.current?.focus();
  }, [questionIndex]);

  const question: Question = QUESTIONS[questionIndex];
  const unlockedCount = phase === "revealing" ? questionIndex + 1 : questionIndex;
  const isFakeOut = question.kind === "text" && question.fakeOut === true;

  const handleCorrect = useCallback(() => {
    setError(false);
    setShaking(false);
    setPhase("revealing");
    setJustRevealed(questionIndex);
    advanceTimer.current = setTimeout(() => {
      setJustRevealed(null);
      if (questionIndex + 1 >= QUESTIONS.length) {
        setPhase("victory");
      } else {
        setQuestionIndex((i) => i + 1);
        setSelectedOption(null);
        setTextValue("");
        setShowHint(false);
        setPhase("question");
      }
    }, REVEAL_DELAY_MS);
  }, [questionIndex]);

  const handleWrong = useCallback(() => {
    setError(true);
    // Drop and re-add the shake class across two frames so the animation
    // restarts even when the previous shake is still mid-flight.
    setShaking(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setShaking(true));
    });
  }, []);

  const submitMultipleChoice = useCallback(() => {
    if (question.kind !== "multiple-choice" || selectedOption === null) return;
    if (selectedOption === question.correctIndex) {
      handleCorrect();
    } else {
      handleWrong();
    }
  }, [question, selectedOption, handleCorrect, handleWrong]);

  const submitText = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (question.kind !== "text") return;
      if (textValue.trim().length === 0) return;
      if (isTextAnswerCorrect(textValue, question)) {
        handleCorrect();
      } else {
        handleWrong();
      }
    },
    [question, textValue, handleCorrect, handleWrong]
  );

  if (phase === "victory") {
    return (
      <div className="w-full max-w-2xl">
        <VictoryScreen />
      </div>
    );
  }

  const revealing = phase === "revealing";

  return (
    <div className="w-full max-w-2xl">
      {/* ---------- HEADER ---------- */}
      <header className="mb-6 text-center sm:mb-8">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Zap className="h-5 w-5 text-neon-400" aria-hidden="true" />
          <span className="font-display text-[10px] font-medium tracking-[0.4em] text-neon-400/80 uppercase">
            Horizon Festival Presents
          </span>
          <Zap className="h-5 w-5 text-neon-400 -scale-x-100" aria-hidden="true" />
        </div>
        <h1 className="font-display bg-gradient-to-r from-neon-400 via-white to-neon-400 bg-clip-text text-3xl font-black tracking-[0.12em] text-transparent uppercase drop-shadow-[0_0_20px_rgba(0,217,255,0.35)] sm:text-5xl">
          Code Vault
        </h1>
        <p className="mt-2 text-base font-medium text-carbon-200 sm:text-lg">
          5 questions. 5 segments. 1 Forza Horizon code.
        </p>
      </header>

      {/* ---------- CODE VAULT ---------- */}
      <section
        aria-label="Game code progress"
        className="mb-6 rounded-xl border border-carbon-600/80 bg-carbon-900/70 px-3 py-4 backdrop-blur-sm sm:px-5"
      >
        <div className="mb-3 flex items-center justify-center gap-2">
          {unlockedCount >= CODE_SEGMENTS.length ? (
            <Unlock className="h-3.5 w-3.5 text-neon-400" aria-hidden="true" />
          ) : (
            <Lock className="h-3.5 w-3.5 text-carbon-300" aria-hidden="true" />
          )}
          <span className="font-display text-[10px] tracking-[0.3em] text-carbon-300 uppercase">
            {unlockedCount}/5 segments decrypted
          </span>
        </div>
        <CodeDisplay unlockedCount={unlockedCount} justRevealed={justRevealed} />
      </section>

      {/* ---------- PROGRESS LIGHTS ---------- */}
      <div className="mb-6">
        <ProgressLights
          current={questionIndex}
          total={QUESTIONS.length}
          done={false}
        />
      </div>

      {/* ---------- QUESTION CARD ---------- */}
      <div key={questionIndex} className="animate-slide-fade-in">
      <div
        onAnimationEnd={(e) => {
          if (e.animationName === "shake") setShaking(false);
        }}
        className={`${shaking ? "animate-shake" : ""} relative overflow-hidden rounded-2xl border bg-carbon-900/80 backdrop-blur-sm ${
          isFakeOut
            ? "animate-warn-pulse border-taillight-500"
            : error
              ? "border-taillight-500/70 shadow-[0_0_30px_rgba(255,39,67,0.15)]"
              : "border-carbon-600/80 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        }`}
      >
        {/* speedline accent across the top */}
        <div className="relative h-[3px] w-full overflow-hidden bg-carbon-800">
          <div
            className={`animate-speedline absolute inset-y-0 w-1/3 ${
              isFakeOut
                ? "bg-gradient-to-r from-transparent via-taillight-500 to-transparent"
                : "bg-gradient-to-r from-transparent via-neon-500 to-transparent"
            }`}
          />
        </div>

        <div className="p-5 sm:p-8">
          {/* category + question number */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <span
              className={`font-display inline-flex items-center gap-2 rounded border px-2.5 py-1 text-[10px] font-bold tracking-[0.25em] uppercase ${
                isFakeOut
                  ? "border-taillight-500/60 bg-taillight-500/10 text-taillight-400"
                  : "border-neon-500/40 bg-neon-500/10 text-neon-400"
              }`}
            >
              {isFakeOut && (
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {question.category}
            </span>
            <span className="font-display text-[10px] tracking-[0.3em] text-carbon-300 uppercase">
              Question {questionIndex + 1} / {QUESTIONS.length}
            </span>
          </div>

          {/* fake-out warning banner */}
          {isFakeOut && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-taillight-500/70 bg-taillight-500/10 p-4"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <AlertTriangle
                  className="animate-warn-blink h-5 w-5 shrink-0 text-taillight-400"
                  aria-hidden="true"
                />
                <span className="font-display animate-warn-blink text-xs font-black tracking-[0.25em] text-taillight-400 uppercase">
                  Warning — Single Attempt Protocol
                </span>
                <AlertTriangle
                  className="animate-warn-blink h-5 w-5 shrink-0 text-taillight-400"
                  aria-hidden="true"
                />
              </div>
              <p className="text-[15px] leading-snug font-semibold text-taillight-400/95">
                You only get <span className="font-black underline">ONE</span>{" "}
                chance to answer this correctly. There is only{" "}
                <span className="font-black underline">ONE</span> true answer.
                Choose wisely.
              </p>
            </div>
          )}

          {/* prompt */}
          <h2
            ref={promptRef}
            tabIndex={-1}
            className="mb-5 text-xl leading-snug font-bold text-white focus:outline-none sm:text-2xl"
          >
            {question.prompt}
          </h2>

          {/* image (Q2) */}
          {question.kind === "text" && question.imageUrl && (
            <div className="mb-5">
              <QuestionImage src={question.imageUrl} />
            </div>
          )}

          {/* ---------- ANSWERS ---------- */}
          {question.kind === "multiple-choice" ? (
            <div className="flex flex-col gap-2.5">
              {question.options.map((option, i) => {
                const selected = selectedOption === i;
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={revealing}
                    aria-pressed={selected}
                    onClick={() => {
                      setSelectedOption(i);
                      setError(false);
                    }}
                    className={`group flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 text-left text-base font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-400 disabled:cursor-default sm:text-lg ${
                      selected
                        ? "border-neon-500/80 bg-neon-500/10 text-white shadow-[0_0_18px_rgba(0,217,255,0.2)]"
                        : "border-carbon-600 bg-carbon-850 text-carbon-200 hover:border-carbon-400 hover:bg-carbon-800 hover:text-white"
                    }`}
                  >
                    <span
                      className={`font-display flex h-7 w-7 shrink-0 items-center justify-center rounded border text-xs font-bold ${
                        selected
                          ? "border-neon-400 bg-neon-500/20 text-neon-400"
                          : "border-carbon-500 text-carbon-300 group-hover:border-carbon-300"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={submitMultipleChoice}
                disabled={selectedOption === null || revealing}
                className="font-display mt-3 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-neon-500/70 bg-neon-500/10 px-6 py-3.5 text-sm font-bold tracking-[0.2em] text-neon-400 uppercase transition-all duration-200 hover:bg-neon-500/20 hover:shadow-[0_0_24px_rgba(0,217,255,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:border-carbon-600 disabled:bg-carbon-850 disabled:text-carbon-400 disabled:shadow-none"
              >
                Lock It In <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <form onSubmit={submitText} className="flex flex-col gap-3">
              <input
                type="text"
                value={textValue}
                onChange={(e) => {
                  setTextValue(e.target.value);
                  setError(false);
                }}
                disabled={revealing}
                placeholder={question.placeholder}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label="Your answer"
                className={`w-full rounded-lg border bg-carbon-950/80 px-4 py-3.5 text-lg font-semibold text-white placeholder-carbon-400 transition-all duration-200 focus:outline-none ${
                  isFakeOut
                    ? "border-taillight-500/70 focus:border-taillight-400 focus:shadow-[0_0_20px_rgba(255,39,67,0.25)]"
                    : error
                      ? "border-taillight-500/70 focus:border-taillight-400"
                      : "border-carbon-600 focus:border-neon-500 focus:shadow-[0_0_20px_rgba(0,217,255,0.15)]"
                }`}
              />
              <button
                type="submit"
                disabled={textValue.trim().length === 0 || revealing}
                className={`font-display inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-6 py-3.5 text-sm font-bold tracking-[0.2em] uppercase transition-all duration-200 focus:outline-none focus-visible:ring-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:border-carbon-600 disabled:bg-carbon-850 disabled:text-carbon-400 disabled:shadow-none ${
                  isFakeOut
                    ? "border-taillight-500/80 bg-taillight-500/10 text-taillight-400 hover:bg-taillight-500/20 hover:shadow-[0_0_24px_rgba(255,39,67,0.3)] focus-visible:ring-taillight-400"
                    : "border-neon-500/70 bg-neon-500/10 text-neon-400 hover:bg-neon-500/20 hover:shadow-[0_0_24px_rgba(0,217,255,0.3)] focus-visible:ring-neon-400"
                }`}
              >
                {isFakeOut ? "Submit Final Answer" : "Lock It In"}{" "}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          )}

          {/* ---------- FEEDBACK ROW ---------- */}
          <div className="mt-4 flex min-h-7 flex-wrap items-center justify-between gap-2">
            {/* live region holds ONLY the status text, so hint toggles don't
                trigger spurious screen-reader announcements */}
            <div aria-live="polite">
              {revealing ? (
                <span className="inline-flex items-center gap-2 text-base font-bold text-neon-400">
                  <Unlock className="h-4 w-4" aria-hidden="true" />
                  Correct — segment {questionIndex + 1} decrypted!
                </span>
              ) : error ? (
                <span className="inline-flex items-center gap-2 text-base font-bold text-taillight-400">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  Wrong answer. Re-grip and try again.
                </span>
              ) : null}
            </div>

            {/* hint (Q1–Q4 only) */}
            {question.hint && !revealing && (
              <button
                type="button"
                onClick={() => setShowHint((h) => !h)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded px-1 py-0.5 text-sm font-semibold text-hintamber-400/90 transition-colors hover:text-hintamber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-hintamber-400"
              >
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                {showHint ? "Hide hint" : "Need a hint?"}
              </button>
            )}
          </div>

          {showHint && question.hint && !revealing && (
            <div className="animate-slide-fade-in mt-2 rounded-lg border border-hintamber-500/40 bg-hintamber-500/5 px-4 py-3 text-[15px] font-medium text-hintamber-400/95">
              {question.hint}
            </div>
          )}
        </div>
      </div>
      </div>

      <footer className="mt-6 text-center">
        <p className="font-display text-[9px] tracking-[0.35em] text-carbon-400 uppercase">
          Answer all 5 to claim your code
        </p>
      </footer>
    </div>
  );
}
