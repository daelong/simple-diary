module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: "plugin:vue/essential",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {
    indent: ["error", 4],
    semi: ["error", "always"],
    "no-trailing-spaces": 0,
    "keyword-spacing": 0,
    "no-unused-vars": 1,
    "no-multiple-empty-lines": 0,
    "space-before-function-paren": 0,
    "eol-last": 0,
  },
};
