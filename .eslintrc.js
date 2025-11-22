module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'react-native',
    '@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },

    project: [
      './apps/web/tsconfig.json',
      './apps/mobile/tsconfig.json', 
      './packages/*/tsconfig.json',
    ],
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
    'react-native/react-native': true,
  },

// RULES
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', 

    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',

    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',

    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'off',
  },

  settings: {
    react: { version: 'detect' },
  },

  ignorePatterns: [
    'node_modules',
    'dist',
    'build',
    '*.config.js',
    '.expo',
    'coverage',
  ],
};