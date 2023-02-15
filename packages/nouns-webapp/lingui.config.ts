/**
 * Taken from https://github.com/Uniswap/interface/blob/main/lingui.config.ts with minor modifications
 */
const linguiConfig = {
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}',
      include: ['<rootDir>/src'],
    },
  ],
  compileNamespace: 'cjs',
  fallbackLocales: {
    default: 'ja-JP',
  },
  format: 'po',
  formatOptions: {
    lineNumbers: false,
  },
  locales: ['ja-JP'],
  orderBy: 'messageId',
  rootDir: '.',
  runtimeConfigModule: ['@lingui/core', 'i18n'],
  sourceLocale: 'en-US',
  pseudoLocale: '',
};

export default linguiConfig;
