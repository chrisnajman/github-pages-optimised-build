import themeSwitcher from "./js-modules/theme.js"
import loadingAnimation from "./js-modules/loader.js"

// Comment out or delete, if sticky header not required.
import pageHeaderResizeObserver from "./js-modules/page-header-resize-observer.js"

// Comment out or delete, if mobile menu not required.
import btnHamburger from "./js-modules/primary-navigation/hamburger-button.js"
import primaryNavLinks from "./js-modules/primary-navigation/primary-nav-links.js"

import modulePlaceholder from "./js-modules/module-placeholder.js"

themeSwitcher()
loadingAnimation()
// Comment out or delete, if sticky header not required.
pageHeaderResizeObserver()

// Comment out or delete, if mobile menu not required.
btnHamburger()
primaryNavLinks()

modulePlaceholder()
