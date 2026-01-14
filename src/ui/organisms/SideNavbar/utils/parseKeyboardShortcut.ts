/**
 * Parsed keyboard shortcut result
 */
export interface ParsedKeyboardShortcut {
  /** The main key (lowercase) */
  key: string;
  /** Whether Ctrl/Cmd is required */
  ctrl: boolean;
  /** Whether Shift is required */
  shift: boolean;
  /** Whether Alt is required */
  alt: boolean;
  /** Whether Meta (Windows/Cmd) is required */
  meta: boolean;
  /** Whether the shortcut is valid */
  isValid: boolean;
}

/**
 * Known modifier keys
 */
const MODIFIER_KEYS = ['ctrl', 'cmd', 'control', 'shift', 'alt', 'meta', 'option'] as const;

/**
 * Parse a keyboard shortcut string into its components
 *
 * Supports various formats:
 * - "Ctrl+B" -> { key: 'b', ctrl: true, ... }
 * - "Cmd+Shift+K" -> { key: 'k', ctrl: true, shift: true, ... }
 * - "Alt+Enter" -> { key: 'enter', alt: true, ... }
 * - "Ctrl+Shift+Alt+S" -> { key: 's', ctrl: true, shift: true, alt: true, ... }
 *
 * Modifier aliases:
 * - "cmd" and "control" are aliases for "ctrl"
 * - "option" is an alias for "alt"
 *
 * @param shortcut - The keyboard shortcut string to parse
 * @returns Parsed shortcut object with key and modifiers
 *
 * @example
 * ```ts
 * parseKeyboardShortcut('Ctrl+B')
 * // { key: 'b', ctrl: true, shift: false, alt: false, meta: false, isValid: true }
 *
 * parseKeyboardShortcut('Cmd+Shift+K')
 * // { key: 'k', ctrl: true, shift: true, alt: false, meta: false, isValid: true }
 *
 * parseKeyboardShortcut('')
 * // { key: '', ctrl: false, shift: false, alt: false, meta: false, isValid: false }
 * ```
 */
export function parseKeyboardShortcut(shortcut: string): ParsedKeyboardShortcut {
  // Default invalid result
  const invalidResult: ParsedKeyboardShortcut = {
    key: '',
    ctrl: false,
    shift: false,
    alt: false,
    meta: false,
    isValid: false,
  };

  // Handle empty or invalid input
  if (!shortcut || typeof shortcut !== 'string') {
    return invalidResult;
  }

  // Trim and normalize
  const normalized = shortcut.trim();
  if (!normalized) {
    return invalidResult;
  }

  // Split by '+' and filter empty parts
  const parts = normalized
    .split('+')
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return invalidResult;
  }

  // The last non-modifier part is the main key
  const modifiers = new Set<string>();
  let mainKey = '';

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (MODIFIER_KEYS.includes(part as (typeof MODIFIER_KEYS)[number])) {
      modifiers.add(part);
    } else if (i === parts.length - 1) {
      // Last part should be the main key
      mainKey = part;
    } else {
      // Non-modifier key in the middle is invalid
      return invalidResult;
    }
  }

  // Must have a main key
  if (!mainKey) {
    return invalidResult;
  }

  // Check for ctrl aliases (cmd, control)
  const hasCtrl = modifiers.has('ctrl') || modifiers.has('cmd') || modifiers.has('control');

  // Check for alt aliases (option)
  const hasAlt = modifiers.has('alt') || modifiers.has('option');

  return {
    key: mainKey,
    ctrl: hasCtrl,
    shift: modifiers.has('shift'),
    alt: hasAlt,
    meta: modifiers.has('meta'),
    isValid: true,
  };
}

/**
 * Format a parsed shortcut back to a string (for display)
 *
 * @param shortcut - The parsed shortcut object
 * @param platform - The platform (mac uses symbols, others use text)
 * @returns Formatted shortcut string
 *
 * @example
 * ```ts
 * formatKeyboardShortcut({ key: 'b', ctrl: true, ... }, 'mac')
 * // '⌘B'
 *
 * formatKeyboardShortcut({ key: 'b', ctrl: true, ... }, 'windows')
 * // 'Ctrl+B'
 * ```
 */
export function formatKeyboardShortcut(
  shortcut: ParsedKeyboardShortcut,
  platform: 'mac' | 'windows' | 'linux' = 'windows'
): string {
  if (!shortcut.isValid) return '';

  const parts: string[] = [];

  if (platform === 'mac') {
    // macOS uses symbols
    if (shortcut.ctrl) parts.push('⌘');
    if (shortcut.shift) parts.push('⇧');
    if (shortcut.alt) parts.push('⌥');
    if (shortcut.meta) parts.push('⌃');
    parts.push(shortcut.key.toUpperCase());
    return parts.join('');
  }

  // Windows/Linux use text
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.meta) parts.push('Meta');
  parts.push(shortcut.key.toUpperCase());
  return parts.join('+');
}
