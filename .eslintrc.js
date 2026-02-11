module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': 0,
    'array-callback-return': 1,
    'no-unused-vars': 0,
    'no-duplicate-imports': 2,
    'no-self-compare': 1,
    'no-unmodified-loop-condition': 1,
    'no-use-before-define': 2,
    'no-useless-assignment': 0,
    'require-atomic-updates': 0, // set to 1 in future
    'block-scoped-var': 2,
    complexity: [1, 20],
    // 'max-lines-per-function': [1, 50], // set to 30 in future
    'prefer-const': 1,
    'no-var': 2,
    'no-useless-catch': 2,
    'no-unused-expressions': 2,
    'max-params': 0,
    'max-nested-callbacks': [1, 5], // set to 3 in future
    // 'max-lines': [1, 1000], // set to 300 in future
    // 'max-depth': [1, 5], // set to 3 in future
    '@typescript-eslint/switch-exhaustiveness-check': 2,
  },
};
