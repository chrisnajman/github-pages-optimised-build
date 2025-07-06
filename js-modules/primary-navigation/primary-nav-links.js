export default function primaryNavLinks() {
  const hamburgerButton = document.getElementById("hamburger-button")
  const btnTxt = document.getElementById("btn-txt")
  const siteNavigation = document.getElementById("site-navigation")

  const navLinks = document.querySelectorAll(".site-navigation a")

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburgerButton.setAttribute("aria-expanded", "false")
      btnTxt.textContent = "Expand menu"
      siteNavigation.classList.add("menu-hidden")
      siteNavigation.classList.remove("menu-visible")
    })
  })
}
