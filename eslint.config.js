import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, globalIgnores } from 'eslint/config';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import _import from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default defineConfig([
	globalIgnores(['src/types.ts']),
	{
		extends: fixupConfigRules(
			compat.extends(
				'eslint:recommended',
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended',
				'plugin:import/recommended',
				'plugin:import/typescript',
				'plugin:prettier/recommended',
			),
		),

		plugins: {
			import: fixupPluginRules(_import),
			prettier: fixupPluginRules(prettier),
			'@typescript-eslint': fixupPluginRules(typescriptEslint),
		},

		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
		},

		rules: {
			'@typescript-eslint/no-restricted-types': 'warn',
			eqeqeq: 'warn',
			'import/no-unresolved': 'off',
			indent: ['error', 'tab'],
			'no-console': 'warn',

			'prettier/prettier': [
				'error',
				{
					singleQuote: true,
				},
			],

			quotes: ['error', 'single'],

			'sort-imports': [
				'warn',
				{
					ignoreCase: false,
					ignoreDeclarationSort: true,
				},
			],

			'import/order': [
				'warn',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
					],
				},
			],
		},
	},
]);
