module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-nesting"),
    // postcss-url:
    // If you have any background images create an 'img' folder and put them in there.
    // Then add 'img' to "copy:assets" in package.json.
    // In CSS, use a relative path to the background image, e.g. url(../img/bg-image.jpg)
    require("postcss-url")({
      url: "copy",
      assetsPath: "img",
      useHash: true,
    }),
    require("cssnano")({ preset: "default" }),
  ],
}
