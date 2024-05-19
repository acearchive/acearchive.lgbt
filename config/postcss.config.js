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
      ],
      safelist: [
        "lazyloaded",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "h5",
        "alert-link",
        ...whitelister([
          "./nassets/scss/common/*.scss",
          "./assets/scss/components/*.scss",
          "./assets/scss/layouts/*.scss",
          // "./node_modules/bootstrap/scss/_tooltip.scss",
          "./node_modules/react-bootstrap/**/*.js",
        ]),
      ],
    }),
  ],
};
