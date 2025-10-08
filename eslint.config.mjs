// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    parser: "@typescript-eslint/parser",
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    plugins: [
      "@typescript-eslint"
    ],
    rules: {
      'vue/multi-word-component-names': 'off',
    }
  }
)
