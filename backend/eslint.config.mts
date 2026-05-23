import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
	{
		ignores: ['dist/**', 'node_modules/**', 'src/generated/**'],
	},

	js.configs.recommended,
	...tseslint.configs.recommended,

	{
		files: ['**/*.ts'],
		languageOptions: {
			globals: globals.node,
		},
	},
]
