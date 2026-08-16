import type { Metadata } from "next";
import { QuizTheater } from "@/components/play/QuizTheater";

export const metadata: Metadata = { title: "Quiz" };

export default function QuizPage() {
  return (
    <div className="page max-w-3xl">
      <h1 className="display display-page">Quiz</h1>
      <p className="mt-4 text-ink/70">Ten questions to start. A harder set is also available.</p>
      <QuizTheater />
    </div>
  );
}
