export const RETURN_WINDOW_DAYS = 7;

const RETURN_WINDOW_MS = RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000;

function toSafeDate(value?: string | Date | null): Date | null {
  if (!value) return null;

  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
}

export function getEffectiveDeliveryDate(
  deliveredAt?: string | Date | null,
  fallbackDate?: string | Date | null
): Date | null {
  return toSafeDate(deliveredAt) || toSafeDate(fallbackDate);
}

export function getReturnWindowDeadline(
  deliveredAt?: string | Date | null,
  fallbackDate?: string | Date | null
): Date | null {
  const deliveredDate = getEffectiveDeliveryDate(deliveredAt, fallbackDate);
  if (!deliveredDate) return null;

  return new Date(deliveredDate.getTime() + RETURN_WINDOW_MS);
}

export function isWithinReturnWindow(
  deliveredAt?: string | Date | null,
  now = new Date(),
  fallbackDate?: string | Date | null
): boolean {
  const deadline = getReturnWindowDeadline(deliveredAt, fallbackDate);
  if (!deadline) return false;
  return now.getTime() <= deadline.getTime();
}
