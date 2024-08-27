import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import daStyle from 'eslint-config-dicodingacademy';


export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  daStyle,
  { ignores: ['**/node_modules/**', '**/fixtures/**'] },
  {
    rules: {
      camelcase: 'off'
    }
  }
];