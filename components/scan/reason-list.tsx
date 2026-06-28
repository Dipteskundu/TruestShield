import { AlertTriangle } from "lucide-react";

interface ReasonListProps {
  reasons: string[];
}

export function ReasonList({ reasons }: ReasonListProps) {
  if (!reasons?.length) return null;

  return (
    <ul className="space-y-3">
      {reasons.map((reason, index) => (
        <li
          key={index}
          className="flex gap-3 rounded-md border bg-muted/30 p-3 text-sm"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
          <span>{reason}</span>
        </li>
      ))}
    </ul>
  );
}
