function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Monday of the current week, as YYYY-MM-DD (matches weekly_reviews.week_start). */
export function currentWeekStart(): string {
  const d = new Date();
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day; // shift back to Monday
  d.setDate(d.getDate() + diff);
  return toISODate(d);
}

/** First of the current month, as YYYY-MM-DD (matches monthly_reviews.month_start). */
export function currentMonthStart(): string {
  const d = new Date();
  d.setDate(1);
  return toISODate(d);
}
