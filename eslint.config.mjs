import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: [
			'**/*.d.ts',
			'**/dist/**',
			'**/build/**',
			'**/node_modules/**',
			'apps/editor/**',
			'apps/studio/**'
		]
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['packages/**/*.ts', 'scripts/**/*.ts'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			},
			globals: {
				...globals.node,
				...globals.browser
			}
		},
		rules: {
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn'
		}
	}
];
