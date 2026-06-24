import js from "@eslint/js";
import stylistic from '@stylistic/eslint-plugin';
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js, tseslint, '@stylistic': stylistic },
    extends: ["js/recommended"],
    rules: {
      "@stylistic/semi": ["error", "always"],
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat['jsx-runtime'],
]);
