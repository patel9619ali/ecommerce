export const RETURN_WINDOW_DAYS = 7;

const RETURN_WINDOW_MS = RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000;

export function getReturnWindowDeadline(deliveredAt?: string | Date | null): Date | null {
  if (!deliveredAt) return null;

  const deliveredDate = deliveredAt instanceof Date ? deliveredAt : new Date(deliveredAt);
  if (Number.isNaN(deliveredDate.getTime())) return null;

  return new Date(deliveredDate.getTime() + RETURN_WINDOW_MS);
}

export function isWithinReturnWindow(deliveredAt?: string | Date | null, now = new Date()): boolean {
  const deadline = getReturnWindowDeadline(deliveredAt);
  if (!deadline) return false;
  return now.getTime() <= deadline.getTime();
}
