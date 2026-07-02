import { Badge } from "@/components/ui/badge";

interface CreditBadgeProps {
  remaining: number | null;
  limit: number;
  isGuest: boolean;
  isPro: boolean;
}

export function CreditBadge({ remaining, isGuest, isPro }: CreditBadgeProps) {
  if (isPro) {
    return (
      <Badge variant="default" className="shrink-0">
        Unlimited
      </Badge>
    );
  }

  if (remaining === null) return null;

  const label = isGuest
    ? `${remaining}/2 free`
    : `${remaining}/20 weekly`;

  return (
    <Badge variant="outline" className="shrink-0">
      {label}
    </Badge>
  );
}
