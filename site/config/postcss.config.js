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
        "lazyload",
        "lazyloaded",

        // These are populated by Hugo and don't appear in our HTML.
        "pagination",
        "page-item",
        "page-link",

        // These are from the artifact submission form.
        "btn-secondary",
        "form-check-input",

        ...whitelister(["./node_modules/bootstrap/scss/_tooltip.scss"]),
      ],
    }),
  ],
};
