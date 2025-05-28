import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import jestPlugin from "eslint-plugin-jest";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "*.json",
      "node_modules/",
      "dist/",
      ".eslintrc.json",
      "nodemon.json",
      ".lintstagedrc.json",
      "package*.json",
      "src/migrations/**",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      prettier: prettierPlugin,
      jest: jestPlugin,
    },
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "off",
      "prefer-const": "error",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "no-var": "error",
      "prefer-template": "error",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/require-await": "warn",
      "require-await": "off",
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        { allowExpressions: true },
      ],
      "@typescript-eslint/no-use-before-define": [
        "error",
        {
          functions: false,
          classes: true,
          variables: true,
          typedefs: true,
        },
      ],
      curly: "error",
      eqeqeq: ["error", "always"],
      "no-unused-expressions": "off", // Using @typescript-eslint version instead
      "@typescript-eslint/no-unused-expressions": "error",
      "no-useless-return": "error",
      "no-magic-numbers": "off", // Using @typescript-eslint version instead
      "@typescript-eslint/no-magic-numbers": [
        "warn",
        {
          ignore: [0, 1],
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
        },
      ],
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "no-path-concat": "error",
    },
  },
  prettierConfig,
);
