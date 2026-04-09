/**
 * Static map of fixed-date holidays.
 * Key format: "MM-DD" — we only store holidays with fixed calendar dates.
 * Variable-date holidays (Easter, Diwali, etc.) are omitted for simplicity.
 */
export const HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "01-26": "Republic Day (India)",
  "02-14": "Valentine's Day",
  "03-08": "International Women's Day",
  "03-17": "St. Patrick's Day",
  "05-01": "May Day / Labour Day",
  "07-04": "Independence Day (US)",
  "08-15": "Independence Day (India)",
  "10-02": "Gandhi Jayanti",
  "10-31": "Halloween",
  "11-11": "Veterans Day",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve",
};

/**
 * Check if a given date is a holiday, and return the name if so.
 */
export function getHolidayName(date: Date): string | null {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const key = `${month}-${day}`;
  return HOLIDAYS[key] || null;
}
