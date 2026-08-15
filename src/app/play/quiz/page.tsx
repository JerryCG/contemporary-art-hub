import type { Metadata } from "next";
import { QuizTheater } from "@/components/play/QuizTheater";

export const metadata: Metadata = { title: "Quiz Theater" };

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="chip">100 points, still</p>
      <h1 className="display mt-4 text-5xl">Quiz Theater</h1>
      <p className="mt-4 text-ink/70">
        The original ten questions are intact, including Jerry CG [Doge]. A scholar set waits after.
      </p>
      <QuizTheater />
    </div>
  );
}
