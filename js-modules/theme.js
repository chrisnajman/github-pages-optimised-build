export default function themeSwitcher() {
  const LOCAL_STORAGE_PREFIX = "FILTER_QUOTATIONS"
  const THEME_KEY = `${LOCAL_STORAGE_PREFIX}-theme`

  const themeToggler = document.querySelector(".theme-toggler")
  const light = document.querySelector(".light")
  const dark = document.querySelector(".dark")
  const lightSpan = themeToggler.querySelector(".light .visually-hidden")
  const darkSpan = themeToggler.querySelector(".dark .visually-hidden")
  const toggleButton = themeToggler.querySelector("button")

  function getStoredTheme() {
    try {
      const storedTheme = localStorage.getItem(THEME_KEY)
      return storedTheme ? JSON.parse(storedTheme) : false
    } catch (error) {
      console.error("Error parsing theme from localStorage:", error)
      return false
    }
  }

  let theme = getStoredTheme()

  function setTheme(newTheme) {
    theme = newTheme
    document.documentElement.classList.toggle("darkmode", theme)
    localStorage.setItem(THEME_KEY, theme)

    updateUI()
  }

  function handleMode() {
    setTheme(!theme)
  }

  function updateUI() {
    lightSpan.textContent = theme ? " theme inactive" : " theme active"
    darkSpan.textContent = theme ? " theme active" : " theme inactive"

    const lightSpanText = lightSpan.textContent
    const darkSpanText = darkSpan.textContent

    highlightThemeLabel(lightSpanText, light)
    highlightThemeLabel(darkSpanText, dark)

    toggleButton.setAttribute("aria-pressed", theme ? "false" : "true")
  }

  function highlightThemeLabel(text, shade) {
    text === " theme active"
      ? shade.classList.add("underline")
      : shade.classList.remove("underline")
  }

  toggleButton.addEventListener("click", handleMode)

  setTheme(theme)
}
