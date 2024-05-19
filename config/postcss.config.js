const autoprefixer = require("autoprefixer");
const purgecss = require("@fullhuman/postcss-purgecss");
const whitelister = require("purgecss-whitelister");

module.exports = {
  plugins: [
    autoprefixer(),
    purgecss({
      content: [
        "./node_modules/bootstrap/js/src/collapse.js",
        "./layouts/**/*.html",
        "./content/**/*.md",
        "./assets/js/**/*.js",
        "./assets/js/**/*.ts",
        "./assets/js/**/*.tsx",
      ],
      safelist: [
        "lazyloaded",
        ...whitelister(["./assets/scss/**/*.scss", "./node_modules/react-bootstrap/**/*.js"]),
      ],
    }),
  ],
};
