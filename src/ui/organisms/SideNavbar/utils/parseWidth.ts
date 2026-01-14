/**
 * Parse a width value (number or string) to pixels
 *
 * Supports:
 * - Numbers: returned as-is
 * - Pixel strings: "320px" -> 320
 * - Rem strings: "20rem" -> 320 (assuming 16px base)
 * - Em strings: "20em" -> 320 (assuming 16px base)
 * - Plain numbers as strings: "320" -> 320
 *
 * @param width - The width value to parse
 * @returns The width in pixels
 */
export function parseWidthToPixels(width: number | string): number {
  if (typeof width === 'number') return width;

  const numericValue = parseFloat(width);
  if (isNaN(numericValue)) return 0;

  if (width.endsWith('rem')) return numericValue * 16;
  if (width.endsWith('em')) return numericValue * 16;
  if (width.endsWith('px')) return numericValue;

  return numericValue;
}

/**
 * Validate that minWidth is less than maxWidth
 *
 * @param minWidth - Minimum width in pixels
 * @param maxWidth - Maximum width in pixels
 * @returns True if valid, false otherwise
 */
export function validateWidthBounds(
  minWidth?: number,
  maxWidth?: number
): boolean {
  if (minWidth === undefined || maxWidth === undefined) return true;
  return minWidth < maxWidth;
}

/**
 * Clamp a width value between min and max bounds
 *
 * @param width - The width to clamp
 * @param minWidth - Minimum allowed width
 * @param maxWidth - Maximum allowed width
 * @returns The clamped width value
 */
export function clampWidth(
  width: number,
  minWidth?: number,
  maxWidth?: number
): number {
  let result = width;
  if (minWidth !== undefined) result = Math.max(result, minWidth);
  if (maxWidth !== undefined) result = Math.min(result, maxWidth);
  return result;
}
