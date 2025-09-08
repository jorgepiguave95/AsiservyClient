import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      jsxA11y.flatConfigs.recommended,
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
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // React Rules - Configuración relajada
      'react/react-in-jsx-scope': 'off', // No necesario con React 17+
      'react/prop-types': 'off', // Usamos TypeScript en su lugar
      'react/jsx-uses-react': 'off', // No necesario con React 17+
      'react/jsx-uses-vars': 'warn',
      'react/jsx-key': 'warn', // Cambiado de error a warn
      'react/jsx-no-duplicate-props': 'warn',
      'react/jsx-no-undef': 'warn',
      'react/jsx-pascal-case': 'warn',
      'react/no-direct-mutation-state': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react/require-render-return': 'warn',

      // React Hooks Rules - Solo advertencias
      // 'react-hooks/rules-of-hooks': 'warn',
      // 'react-hooks/exhaustive-deps': 'warn',

      // React Refresh Rules
      'react-refresh/only-export-components': 'off', // Desactivado para permitir exports mixtos

      // TypeScript Rules - Más permisivas
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off', // Permitir any
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off', // Permitir !
      '@typescript-eslint/no-var-requires': 'warn',

      // Reglas de accesibilidad más relajadas
      'jsx-a11y/anchor-is-valid': 'off', // Permitir href="#"
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',

      // General Rules - Menos estrictas
      'no-console': 'off', // Permitir console.log
      'no-debugger': 'warn', // Solo advertir sobre debugger
      'no-unused-vars': 'off', // Usamos la versión de TypeScript
      'prefer-const': 'warn',
      'no-var': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
