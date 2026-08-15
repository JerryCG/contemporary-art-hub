export function Prose({ paragraphs, className = "" }: { paragraphs: string[]; className?: string }) {
  if (!paragraphs?.length) return null;
  return (
    <div className={`prose-hub ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
