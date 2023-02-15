import { Locale as DaysJSLocale } from 'dayjs/locale/en';
import ja from 'dayjs/locale/ja';

export const SUPPORTED_LOCALES = [
  // order as they appear in the language dropdown
  'ja-JP',
];
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = 'ja-JP';

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  'ja-JP': '日本語',
};

export enum Locales {
  ja_JP = 'ja-JP',
}

// Map SupportedLocale string to DaysJS locale object (used for locale aware time formatting)
export const SUPPORTED_LOCALE_TO_DAYSJS_LOCALE: { [locale in SupportedLocale]: DaysJSLocale } = {
  'ja-JP': ja,
};
