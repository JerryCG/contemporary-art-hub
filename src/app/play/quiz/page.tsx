import type { Metadata } from "next";
import { QuizTheater } from "@/components/play/QuizTheater";

export const metadata: Metadata = { title: "Quiz" };

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="display text-5xl">Quiz</h1>
      <p className="mt-4 text-ink/70">Ten questions to start. A harder set is also available.</p>
      <QuizTheater />
    </div>
  );
}
