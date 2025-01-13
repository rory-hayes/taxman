module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:storybook/recommended",
    "prettier"
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react/no-unescaped-entities": "off"
  }
} 