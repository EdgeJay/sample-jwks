module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  ignorePatterns: ['**/bin/**.*', '**/node_modules/**.*'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/standard',
    'prettier/@typescript-eslint',
  ],
  plugins: ['prettier', 'import', '@typescript-eslint'],
  env: {
    node: true,
    es6: true,
  },
  // add your custom rules here
  rules: {
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.js', '**/*.spec.js'] },
    ],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-param-reassign': ['error', { props: false }],
    // Disabled to respect Clean Code Stepdown Rules and arrow function
    'no-use-before-define': 'off',
    'import/prefer-default-export': 'off',
    'prettier/prettier': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-this-alias': 'off',
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'import/named': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: [
              '**/*.test.ts',
              '**/*.spec.ts',
              '**/*.steps.ts',
              './src/utils/cli.ts',
            ],
          },
        ],
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            ignoreRestSiblings: true,
          },
        ],
        '@typescript-eslint/no-this-alias': 'error',
      },
    },
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.d.ts'],
    },
    'import/resolver': {
      typescript: {
        directory: './tsconfig.json',
      },
    },
  },
};
