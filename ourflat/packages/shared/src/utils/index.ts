const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: '\u00a3',
  USD: '$',
  EUR: '\u20ac',
};

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}

export function formatCurrency(amount: number, currency: string = 'GBP'): string {
  return `${CURRENCY_SYMBOLS[currency] ?? '\u00a3'}${amount.toFixed(2)}`;
}

export function getRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getExpirationStatus(expirationDate: string | null): 'expired' | 'urgent' | 'warning' | 'fresh' {
  if (!expirationDate) return 'fresh';
  const now = new Date();
  const exp = new Date(expirationDate);
  const diffDays = Math.floor((exp.getTime() - now.getTime()) / 86400000);
  if (diffDays < 0) return 'expired';
  if (diffDays === 0) return 'urgent';
  if (diffDays <= 3) return 'warning';
  return 'fresh';
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

export function getChoreStreak(completions: { completed_at: string }[], frequency: string): number {
  if (completions.length === 0) return 0;
  const sorted = completions
    .map((c) => new Date(c.completed_at))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 1;
  const expectedInterval =
    frequency === 'daily' ? 1 : frequency === 'weekly' ? 7 : frequency === 'biweekly' ? 14 : 30;

  for (let i = 0; i < sorted.length - 1; i++) {
    const diffDays = Math.floor(
      (sorted[i].getTime() - sorted[i + 1].getTime()) / 86400000
    );
    if (diffDays <= expectedInterval + 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}