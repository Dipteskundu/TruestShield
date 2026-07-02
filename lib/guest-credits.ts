const GUEST_CREDIT_KEY = "trustshield_guest_credits";

const GUEST_LIMIT = 2;

interface GuestCreditUsage {
  [module: string]: number;
}

export function getGuestCredits(): GuestCreditUsage {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(GUEST_CREDIT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getGuestCreditsUsed(module: string): number {
  const credits = getGuestCredits();
  return credits[module] || 0;
}

export function incrementGuestCredits(module: string): number {
  const credits = getGuestCredits();
  credits[module] = (credits[module] || 0) + 1;
  localStorage.setItem(GUEST_CREDIT_KEY, JSON.stringify(credits));
  return credits[module];
}

export function canGuestScan(module: string): boolean {
  return getGuestCreditsUsed(module) < GUEST_LIMIT;
}

export function resetGuestCredits(): void {
  localStorage.removeItem(GUEST_CREDIT_KEY);
}
