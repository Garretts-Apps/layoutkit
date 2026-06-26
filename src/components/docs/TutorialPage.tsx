"use client";

import { useState, useEffect } from "react";
import { TUTORIAL_STEPS } from "@/lib/docs-data";
import { parseJSXToCSS } from "@/lib/compiler";

function useTypewriter(text: string, speed = 35, active = false) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      setDone(false);
      return;
    }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.substring(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, active]);

  return { displayed, done };
}

export function TutorialPage() {
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [code, setCode] = useState(TUTORIAL_STEPS[0].code);
  const [showHint, setShowHint] = useState(false);

  const result = parseJSXToCSS(typing ? "" : code);
  const typewriter = useTypewriter(TUTORIAL_STEPS[step].code, 30, typing);

  useEffect(() => {
    if (typing) {
      setCode(typewriter.displayed);
      if (typewriter.done) setTyping(false);
    }
  }, [typewriter.displayed, typewriter.done, typing]);

  const goToStep = (idx: number) => {
    setStep(idx);
    setCode(TUTORIAL_STEPS[idx].code);
    setTyping(false);
    setShowHint(false);
  };

  const startTyping = () => {
    setCode("");
    setTyping(true);
    setShowHint(false);
  };

  return (
    <div className="mx-auto max-w-[900px] px-6 py-10">
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-zinc-100">
        Interactive Tutorial
      </h1>
      <p className="mb-8 font-sans text-sm text-muted">
        Learn LayoutKit step by step. Watch the code type itself, then
        experiment.
      </p>

      {/* Step nav */}
      <div className="mb-6 flex flex-wrap gap-1">
        {TUTORIAL_STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => goToStep(i)}
            className={`rounded-md px-3.5 py-1.5 text-[11px] font-semibold ${
              step === i
                ? "border border-accent bg-accent/10 text-accent"
                : "border border-zinc-700 bg-surface text-muted"
            }`}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      {/* Current step */}
      <div className="mb-6 overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="mb-1 text-base font-bold text-zinc-100">
              Step {step + 1}: {TUTORIAL_STEPS[step].title}
            </h3>
            <p className="m-0 font-sans text-[13px] text-muted">
              {TUTORIAL_STEPS[step].description}
            </p>
          </div>
          <button
            onClick={startTyping}
            className="whitespace-nowrap rounded-md bg-gradient-to-br from-accent to-purple px-4 py-2 text-xs font-bold text-background"
          >
            &#9654; Watch it type
          </button>
        </div>

        {/* Code + Output */}
        <div className="grid grid-cols-2">
          <div className="border-r border-border">
            <div className="border-b border-border px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              LayoutKit Code
            </div>
            <textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setTyping(false);
              }}
              spellCheck={false}
              className="box-border min-h-[180px] w-full resize-y bg-background p-4 text-[13px] leading-7 text-accent"
            />
          </div>
          <div>
            <div className="border-b border-border px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              Compiled Output
            </div>
            <div className="p-4">
              {result.results.map((r, i) => (
                <div key={i} className="mb-3">
                  <div className="mb-1.5 text-[11px] font-bold text-accent">
                    &lt;{r.component} /&gt;
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {r.css
                      .split(";")
                      .map((decl) => decl.trim())
                      .filter(Boolean)
                      .map((decl, j) => (
                        <span
                          key={j}
                          className="rounded border border-purple/15 bg-purple/10 px-1.5 py-0.5 text-[11px] text-purple"
                        >
                          {decl}
                        </span>
                      ))}
                  </div>
                  <code className="mt-1.5 block text-[11px] text-green">
                    {r.htmlOutput}
                  </code>
                </div>
              ))}
              {result.results.length === 0 && (
                <div className="text-xs italic text-zinc-700">
                  {typing
                    ? "Typing..."
                    : "Edit the code or click 'Watch it type'"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Challenge */}
        <div className="border-t border-border bg-accent/[0.03] px-5 py-3.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-accent">
                Challenge:{" "}
              </span>
              <span className="font-sans text-xs text-zinc-400">
                {TUTORIAL_STEPS[step].challenge}
              </span>
            </div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="rounded border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-600 hover:text-zinc-400"
            >
              {showHint ? "Hide hint" : "Show hint"}
            </button>
          </div>
          {showHint && (
            <div className="mt-2 rounded-md bg-background px-3 py-2 font-sans text-xs leading-relaxed text-muted">
              {TUTORIAL_STEPS[step].hint}
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between">
        <button
          onClick={() => goToStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className={`rounded-md border border-zinc-700 px-4 py-2 text-xs font-semibold ${
            step === 0 ? "text-zinc-700" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          &larr; Previous
        </button>
        <button
          onClick={() =>
            goToStep(Math.min(TUTORIAL_STEPS.length - 1, step + 1))
          }
          disabled={step === TUTORIAL_STEPS.length - 1}
          className={`rounded-md px-4 py-2 text-xs font-bold ${
            step === TUTORIAL_STEPS.length - 1
              ? "bg-border text-zinc-600"
              : "bg-gradient-to-br from-accent to-purple text-background"
          }`}
        >
          Next Step &rarr;
        </button>
      </div>
    </div>
  );
}
