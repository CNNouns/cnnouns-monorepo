/**
 * useActiveLocale.ts is a modified version of https://github.com/Uniswap/interface/blob/main/src/hooks/useActiveLocale.ts
 */
import { DEFAULT_LOCALE, SupportedLocale } from '../i18n/locales';

// Only enables ja-JP locale
export const initialLocale = DEFAULT_LOCALE;

/**
 * Returns the currently active locale, from a combination of user agent, query string, and user settings stored in redux
 * Stores the query string locale in redux (if set) to persist across sessions
 */
export function useActiveLocale(): SupportedLocale {
  return DEFAULT_LOCALE;
}
