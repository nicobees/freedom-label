import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import compat from 'eslint-plugin-compat';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import react from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect';
import sonarjs from 'eslint-plugin-sonarjs';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const constants = {
  ALWAYS: 'always',
  ERROR: 'error',
  NEVER: 'never',
  OFF: 'off',
  WARN: 'warn',
};

export default tseslint.config([
  {
    ignores: ['dist/', '**/*.config.js'],
  },
  {
    extends: [
      compat.configs['flat/recommended'],
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      importPlugin.flatConfigs.recommended,
      eslintConfigPrettier,
      sonarjs.configs.recommended,
      perfectionist.configs['recommended-natural'],
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactCompiler.configs.recommended,
      reactYouMightNotNeedAnEffect.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'jsx-a11y': jsxA11y,
      'react-you-might-not-need-an-effect': reactYouMightNotNeedAnEffect,
    },
    rules: {
      'compat/compat': constants.WARN,
      'import/no-duplicates': constants.OFF,
      'import/no-extraneous-dependencies': [
        constants.ERROR,
        {
          devDependencies: [
            '**/*.test.{js,jsx,ts,tsx}',
            '**/*.config.js',
            '**/tests/*',
            '**/test/*',
            '**/mocks/*',
            '**/.eslintrc.js',
          ],
        },
      ],
      'import/order': constants.OFF,
      'import/prefer-default-export': constants.OFF,
      'jsx-a11y/alt-text': constants.OFF,
      'perfectionist/sort-imports': [
        constants.ERROR,
        {
          groups: [
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          order: 'asc',
          type: 'natural',
        },
      ],
      'perfectionist/sort-union-types': [
        constants.ERROR,
        {
          order: 'asc',
          type: 'natural',
        },
      ],
      'react-compiler/react-compiler': constants.ERROR,
      'react-hooks/exhaustive-deps': constants.ERROR,
      'react-hooks/rules-of-hooks': constants.ERROR,
      'react/function-component-definition': [
        constants.ERROR,
        {
          namedComponents: ['function-declaration', 'arrow-function'],
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-curly-brace-presence': [
        constants.ERROR,
        { children: 'never', propElementValues: 'always', props: 'never' },
      ],
      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.js', '.jsx'],
        },
      ],
      'react/jsx-indent': constants.OFF,
      'react/jsx-indent-props': [2, 'tab'],
      'react/jsx-no-constructed-context-values': constants.OFF,
      'react/jsx-no-leaked-render': constants.ERROR,
      'react/jsx-no-target-blank': [
        1,
        {
          allowReferrer: true,
        },
      ],
      'react/jsx-no-useless-fragment': [
        constants.ERROR,
        { allowExpressions: true },
      ],
      'react/jsx-props-no-spreading': constants.OFF,
      'react/prop-types': constants.OFF,
      'react/require-default-props': constants.OFF,
      'sonarjs/content-security-policy': constants.OFF,
      'sonarjs/fixme-tag': constants.OFF,
      'sonarjs/function-return-type': constants.OFF,
      'sonarjs/future-reserved-words': constants.OFF,
      'sonarjs/hashing': constants.OFF,
      'sonarjs/no-duplicate-string': constants.OFF,
      'sonarjs/no-globals-shadowing': constants.OFF,
      'sonarjs/no-ignored-exceptions': constants.OFF,
      'sonarjs/no-implicit-global': constants.OFF,
      'sonarjs/no-nested-functions': constants.OFF,
      'sonarjs/no-referrer-policy': constants.OFF,
      'sonarjs/no-selector-parameter': constants.OFF,
      'sonarjs/os-command': constants.OFF,
      'sonarjs/prefer-read-only-props': constants.OFF,
      'sonarjs/redundant-type-aliases': constants.OFF,
      'sonarjs/todo-tag': constants.OFF,
      'sonarjs/use-type-alias': constants.OFF,
      'sonarjs/void-use': constants.OFF,
    },
  },
  {
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/await-thenable': constants.ERROR,
      '@typescript-eslint/consistent-type-imports': constants.ERROR,
      '@typescript-eslint/naming-convention': [
        constants.ERROR,
        {
          filter: {
            match: false,
            regex: '^(HTML|CSW|CMS|SSR)',
          },
          format: ['StrictPascalCase'],
          selector: 'typeLike',
        },
      ],
      '@typescript-eslint/no-explicit-any': constants.ERROR,
      '@typescript-eslint/no-floating-promises': constants.ERROR,
      '@typescript-eslint/no-import-type-side-effects': constants.ERROR,
      '@typescript-eslint/no-unnecessary-type-assertion': constants.ERROR,
      '@typescript-eslint/no-unused-vars': [
        constants.ERROR,
        { ignoreRestSiblings: true },
      ],
      '@typescript-eslint/prefer-for-of': constants.ERROR,
      '@typescript-eslint/require-await': constants.ERROR,
      'react/jsx-filename-extension': constants.OFF,
    },
  },
  {
    extends: [testingLibrary.configs['flat/react']],
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'testing-library/no-container': 'error',
      'testing-library/no-node-access': 'error',
    },
  },
]);
