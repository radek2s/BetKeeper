module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-extra-semi': ['off'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-magic-numbers': ['warn', { ignore: [0, 1, 2], ignoreDefaultValues: true }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
