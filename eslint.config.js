// eslint.config.js
import antfu from "@antfu/eslint-config";

export default antfu(
  {
    stylistic: {
      quotes: "double",
      semi: true,
    },
  },
  {
    rules: {
      "antfu/if-newline": 0,
      "ts/no-unused-vars": 2,
    },
  },
);
