// Comment out or delete this file, if sticky header not required.
export default function pageHeaderResizeObserver() {
  const root = document.querySelector("html")
  const pageHeader = document.querySelector(".header")

  const pageHeaderObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      // Header’s computed styles for padding
      const headerStyles = getComputedStyle(entry.target)

      // Root’s computed styles for the skip-link gap variable
      const rootStyles = getComputedStyle(root)

      const paddingBlockStart = parseFloat(headerStyles.paddingBlockStart)
      const paddingBlockEnd = parseFloat(headerStyles.paddingBlockEnd)
      const entryTopBotPadding = paddingBlockStart + paddingBlockEnd

      // Extra breathing room from CSS variable (default: 0 if missing)
      const skipLinkGap =
        parseFloat(rootStyles.getPropertyValue("--skip-link-gap")) || 0

      const customAdjustment = entryTopBotPadding + skipLinkGap

      const pageHeaderHeightRems =
        (entry.contentRect.height + customAdjustment) / 16

      root.style = `scroll-padding-top: ${pageHeaderHeightRems}rem`
    }
  })

  pageHeaderObserver.observe(pageHeader)
}
