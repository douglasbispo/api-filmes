import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "commonjs",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "no-undef": "off",
    },
  },
  js.configs.recommended,
];
