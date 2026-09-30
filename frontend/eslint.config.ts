import js from "@eslint/js";
import stylistic from '@stylistic/eslint-plugin';
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js, tseslint, '@stylistic': stylistic },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      eslintReact.configs["recommended-typescript"],
    ],
    rules: {
      "@stylistic/semi": ["error", "always"],
    },
  },
]);
