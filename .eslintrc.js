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
    "eslint:recommended",
    "airbnb-base",
    "airbnb-typescript/base",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', "**/node_modules/**", "dist/**", "src/**/*.entity.ts", "src/**/*.event.ts", "src/**/*.schema.ts","src/**/*.model.ts", "src/**/*.dto.ts", "src/db/**", "bin/*"],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "import/prefer-default-export": "off",
    "class-methods-use-this": "off",
    "no-console": "off",
  },
};
