"use client";

import { useMemo, useState } from "react";
import { catalog } from "@/lib/content";
import { ORIGINAL_QUIZ_ANSWERS } from "@/lib/quiz-answers";

type QuizItem = {
  prompt: string;
  options: string[];
  answer?: string;
  image?: string | null;
  audio?: string | null;
};

const scholar: QuizItem[] = [
  {
    prompt: "Who co-founded Cubism with Picasso — and is missing from the original Hub room?",
    options: ["Juan Gris", "Georges Braque", "Fernand Léger", "Jerry CG"],
    answer: "Georges Braque",
  },
  {
    prompt: "Malevich’s Black Square is best described as:",
    options: ["A failed landscape", "The zero of form", "A Dada joke about plumbing", "A Pop advertisement"],
    answer: "The zero of form",
  },
  {
    prompt: "A readymade’s artistic act is primarily:",
    options: ["Virtuoso carving", "Selection, orientation, and naming", "Plein-air observation", "Optical mixture"],
    answer: "Selection, orientation, and naming",
  },
  {
    prompt: "Which room comes, historically, as a purge after Abstract Expressionism’s confession?",
    options: ["Fauvism", "Impressionism", "Minimalism", "Symbolism"],
    answer: "Minimalism",
  },
  {
    prompt: "On Kawara’s date paintings treat which material as primary?",
    options: ["Marble", "Time", "Neon", "Soup"],
    answer: "Time",
  },
];

export function QuizTheater() {
  const original = useMemo(
    () =>
      catalog.quiz.questions.map((q, i): QuizItem => ({
        prompt: q.prompt,
        options: q.options.map((o) => o.value),
        answer: ORIGINAL_QUIZ_ANSWERS[i],
        image: q.image,
        audio: q.audio,
      })),
    [],
  );
  const [setName, setSetName] = useState<"original" | "scholar">("original");
  const questions = setName === "original" ? original : scholar;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);

  const score = questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  const pct = Math.round((score / questions.length) * 100);

  function verdict() {
    if (pct <= 20) return "You are a totally new friend to contemporary art.";
    if (pct <= 50) return "You know some basic things. Keep looking.";
    if (pct <= 70) return "You have a good knowledge. Well done.";
    if (pct <= 90) return "You are already an expert in this house.";
    return "You are a genius of contemporary art.";
  }

  return (
    <div className="mt-10">
      <div className="flex gap-2">
        {(["original", "scholar"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setSetName(s);
              setAnswers({});
              setDone(false);
            }}
            className={`rounded-full px-4 py-1.5 text-[12px] uppercase tracking-[0.16em] ${setName === s ? "bg-ink text-paper" : "border border-ink/15"}`}
          >
            {s}
          </button>
        ))}
      </div>
      {!done ? (
        <form
          className="mt-8 space-y-10"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          {questions.map((q, i) => (
            <fieldset key={q.prompt}>
              <legend className="display text-2xl">
                {i + 1}. {q.prompt}
              </legend>
              {q.image ? <img src={q.image} alt="" className="mt-4 max-h-56" /> : null}
              {q.audio ? <audio className="mt-4" controls src={q.audio} /> : null}
              <div className="mt-4 space-y-2">
                {q.options.map((opt) => (
                  <label key={opt} className="flex cursor-pointer items-center gap-3 border border-transparent px-2 py-1 hover:border-ink/10">
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={opt}
                      checked={answers[i] === opt}
                      onChange={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button type="submit" className="rounded-full bg-ink px-6 py-2 text-paper">
            Score me
          </button>
        </form>
      ) : (
        <div className="mt-10 border border-ink/10 p-5 sm:p-8">
          <p className="display display-page">{pct}</p>
          <p className="mt-3 text-lg">{verdict()}</p>
          <p className="mt-2 text-sm text-ink/55">
            {score} / {questions.length}
          </p>
          <button
            type="button"
            className="mt-6 underline"
            onClick={() => {
              setDone(false);
              setAnswers({});
            }}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
