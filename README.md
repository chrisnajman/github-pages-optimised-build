# GitHub Pages Optimised Build

> [!IMPORTANT]  
> The following assumes you have Node.js installed on your machine.

**GitHub Pages Optimised Build** is a test project designed to demonstrate an automated front-end build pipeline using modern tooling. The key purpose is to:

- Automatically bundle and minify JavaScript, process and minify CSS (including nesting), and minify HTML
- Save all production-ready assets into a `/docs` folder
- Configure GitHub Pages to serve the site directly from `/docs`

This approach ensures the original development files (with modular JS, nested CSS, and unminified HTML) stay intact in the root of the project, while the optimized output is safely contained and served from `/docs`.

The build process is fully scriptable using NPM scripts, with no reliance on tools like Webpack or Gulp.

[View on GitPage](https://chrisnajman.github.io/github-pages-optimised-build)

---

### Why `/docs`?

- The `/docs` folder contains optimized production-ready assets, including:
  - `bundle.js`: the JavaScript bundled into a single file (no modules)
  - `style.min.css`: the CSS processed with nesting flattened and minified
- The original source files (`index.js`, files in `js-modules/`, `style.css` with nesting, etc.) remain in the project root for easier development and editing.
- GitHub Pages is configured to serve the site from the `/docs` folder instead of the root, so your published site uses these optimized files.

> [!IMPORTANT]
> The build process only supports a **flat** HTML structure, i.e. all HTML pages must sit in the root of the project (no folders).

> [!IMPORTANT]
> When publishing to GitHub Pages, make sure the Pages setting is configured to serve from the `/docs` folder on the `main` branch.

---

## Build & Deployment Setup for `/docs` Folder

### 1. Install Required Packages

Run this once in your project root to install dev dependencies:

```bash
npm install --save-dev esbuild html-minifier-terser postcss postcss-cli postcss-import postcss-nesting cssnano shx
```

- **esbuild** — bundles, transpiles (to ES2015), and minifies JS
- **html-minifier-terser** — minifies HTML files in the `/docs` folder after copying and post-processing
- **postcss, postcss-cli** — for CSS processing
- **postcss-import** — enables @import rules in CSS for modular stylesheets
- **postcss-nesting** — enables CSS nesting support
- **postcss-url** — processes and rewrites URLs in CSS (e.g., copying assets and adjusting paths) for correct referencing in the build output
- **cssnano** — minifies CSS
- **shx** — cross-platform CLI utility (copy, rm, etc.)

> [!NOTE]
> For the current project, `package.json` and `package-lock.json` already contain references to all the required `npm` packages, so all you have to do is run `npm install` in the terminal to install `node_modules` (which will contain the required packages).

---

### 2. Create `postcss.config.js` in project root

```js
module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-nesting"),
    require("postcss-url")({
      url: "copy",
      assetsPath: "img",
      useHash: true,
    }),
    require("cssnano")({ preset: "default" }),
  ],
}}
```

> [!NOTE]
> For the current project, `postcss.config.js` already exists in the project root.

---

### 3. Add build scripts to `package.json`

```json
{
  "scripts": {
    "build:js": "esbuild index.js --bundle --minify --target=es2015 --outfile=docs/bundle.js", // bundles, transpiles to ES2015, and minifies
    "build:css": "postcss style.css --output docs/style.min.css",
    "copy:assets": "shx cp -r img favicon.ico favicon-16x16.png favicon-32x32.png apple-touch-icon.png android-chrome-192x192.png android-chrome-512x512.png docs/", // Add or remove items from here as required - do not touch shx cp -r OR docs/
    "copy:html": "shx cp *.html docs/",
    "postprocess:html": "node scripts/postprocess-html.js",
    "build": "npm run build:js && npm run build:css && npm run copy:assets && npm run copy:html && npm run postprocess:html"
  }
}
```

> [!NOTE]
> For the current project, build scripts have already been added to `package.json`.

> [!NOTE]
> The `copy:assets` script includes the required files for the current project. You can edit it to include additional folders or assets as needed.

> [!WARNING]
> Do **not** include `node_modules`, `scripts/postprocess-html.js`, `.gitignore`, `README.md` or `LICENSE` in the `copy:assets` script.

---

### 4. Create the HTML post-processing script

Create a folder called `scripts` in your project root, and inside it, create a file named `postprocess-html.js` with this content:

```js
const fs = require("fs")
const path = require("path")
const { minify } = require("html-minifier-terser")

const docsDir = "docs"

const minifyOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  minifyCSS: true,
  minifyJS: true,
}

;(async () => {
  const files = fs.readdirSync(docsDir)

  for (const file of files) {
    if (file.endsWith(".html")) {
      const filePath = path.join(docsDir, file)
      const rawContent = fs.readFileSync(filePath, "utf-8")

      try {
        let content = await minify(rawContent, minifyOptions)

        // Replace JS and CSS references
        content = content
          .replace(
            /<script[^>]*\s(src=["']\.?\/index\.js["'])[^>]*type=["']module["'][^>]*><\/script>/i,
            '<script src="./bundle.js" defer></script>'
          )

          .replace(
            /<link[^>]+href=["']\.?\/style\.css["'][^>]*>/i,
            '<link rel="stylesheet" href="./style.min.css">'
          )

        fs.writeFileSync(filePath, content, "utf-8")
      } catch (err) {
        console.error(`Failed to process ${file}:`, err)
      }
    }
  }
})()
```

> [!NOTE]
> For the current project, `scripts/postprocess-html.js` already exists in the project root.

---

### 5. Run the full build process

In the terminal, run:

```bash
npm run build

```

This will:

- Bundle and minify JS into `/docs/bundle.js`
- Process and minify CSS into `/docs/style.min.css`
- Copy assets (folders like `/css`, `/img`, `/fonts`, and files like `favicon.ico`) into `/docs`
- Copy all root HTML files into `/docs`
- Modify the copied HTML files in `/docs` to reference the optimized JS and CSS files

> [!NOTE]
> In the current project, the initial `npm run build` has already been run. However, any subsequent edits made to files and assets in the root of the project will necessitate further builds.

---

## CSS

Built with modern CSS features such as nesting, custom properties, and the `:has()` pseudo-class, this project emphasizes modular, accessible, and maintainable styling.

The main `style.css` file serves as an entry point and imports individual CSS modules using `@import`. These are then processed by PostCSS (with `postcss-import`, `postcss-nesting`, and `cssnano`) during the build.

The CSS has been split into separate modules, improving organization and reusability:

- `root.css`: Global CSS custom properties (`--variables`) for themes, layout, and design tokens.
- `base.css`: Global reset and base element styles.
- `navigation.css`: Styles the primary navigation and hamburger menu.
- `theme-toggler.css`: Styles the dark/light mode toggle control.
- `loader.css`: Styles the full-screen loading overlay that appears while the page is initializing.
- `project-specific.css`: Contains small, per-project overrides or additions.

> [!NOTE]
> If you later revert to a single stylesheet without imports, the build process will continue to work seamlessly, as `postcss-import` gracefully handles the absence of `@import` statements.

---

## JavaScript

Built with **vanilla ES6 JavaScript**, focusing on modern syntax and browser APIs, , then bundled, transpiled to ES2015, and minified for broad browser compatibility.

The JavaScript has been split into separate modules, improving code modularity:

- `module-placeholder.js`: Empty module, imported into `index.js`.
- `primary-navigation.js` and `hamburger-button.js`: See [Accessible Mobile Menu Git repository](https://github.com/chrisnajman/accessible-mobile-menu)
- `loader.js`: Displays a loader animation until the page is fully rendered, then removes the loader and announces readiness for screen readers.
- `theme.js`: Handles theme toggling (light/dark mode) and local storage management.

---

## Accessibility

The site is fully navigable using tab keys and up/down arrows.

---

## Theme Toggling

The application includes a dark mode and light mode toggle:

- The current theme state is stored in **local storage** and applied automatically on page reload.
- Accessible buttons with appropriate ARIA attributes are used to improve usability.

> [!IMPORTANT]
> Remember to change `const LOCAL_STORAGE_PREFIX` in `js-modules/theme.js` to a unique identifier.

---

## Testing and Compatibility

The application has been tested on the following platforms and browsers:

- **Operating System**: Windows 10
- **Browsers**:
  - Google Chrome
  - Mozilla Firefox
  - Microsoft Edge

### Device View Testing

The layout and functionality have been verified in both browser and device simulation views to ensure responsiveness and usability.

---

## How to Run

1. Clone or download the repository to your local machine.
2. Open the project folder and start a simple HTTP server (e.g., using `Live Server` in VS Code or Python's `http.server` module).
3. Open the project in a modern browser (e.g., Chrome, Firefox, or Edge).

---
