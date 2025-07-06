const fs = require("fs")
const path = require("path")
const { minify } = require("html-minifier-terser")

const docsDir = "docs"

const minifyOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  useShortDoctype: true,
  removeEmptyAttributes: true,
  minifyCSS: true,
  minifyJS: true,
}

;(async () => {
  const files = fs.readdirSync(docsDir)

  for (const file of files) {
    if (file.endsWith(".html")) {
      const filePath = path.join(docsDir, file)
      let content = fs.readFileSync(filePath, "utf-8")

      // Replace module script and stylesheet references
      content = content
        .replace(
          /<script\s+type="module"\s+src="\.?\/index\.js"><\/script>/,
          '<script src="./bundle.js" defer></script>'
        )
        .replace(
          /<link\s+rel="stylesheet"\s+href="\.?\/style\.css">/,
          '<link rel="stylesheet" href="./style.min.css">'
        )

      // Minify the HTML content
      const minified = await minify(content, minifyOptions)

      fs.writeFileSync(filePath, minified, "utf-8")
    }
  }
})()
