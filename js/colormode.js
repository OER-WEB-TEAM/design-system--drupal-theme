/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

/*
  This script is adjusted from the original Bootstrap version, to allow 
  for <i> tag icons, instead of <svg>
  */
(() => {
  "use strict";

  const getStoredTheme = () => localStorage.getItem("theme");
  const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const setTheme = (theme) => {
    if (
      theme === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-bs-theme", theme);
    }
  };

  setTheme(getPreferredTheme());

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector("#bd-theme");

    if (!themeSwitcher) {
      return;
    }

    const themeSwitcherText = document.querySelector("#bd-theme-text");
    const activeThemeIcon = document.querySelector("#bd-theme i");
    const activeThemeLi = document.querySelectorAll("#bd-theme + ul li");

    activeThemeIcon.classList =
      theme === "light"
        ? "bi bi-sun-fill"
        : theme === "dark"
        ? "bi bi-moon-stars-fill"
        : "bi bi-circle-half";

    activeThemeLi.forEach((li) => {
      var button = li.firstElementChild;
      var checkIcon = button.lastElementChild;
      if (button.dataset.bsThemeValue !== theme) {
        button.classList.remove("active");
        checkIcon.classList.add("d-none");
      } else {
        button.classList.add("active");
        checkIcon.classList.remove("d-none");
      }

      themeSwitcher.setAttribute(
        "aria-label",
        `${themeSwitcherText.textContent} (${button.dataset.bsThemeValue})`
      );
    });

    if (focus) {
      themeSwitcher.focus();
    }
  };

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const storedTheme = getStoredTheme();
      if (storedTheme !== "light" && storedTheme !== "dark") {
        setTheme(getPreferredTheme());
      }
    });

  window.addEventListener("DOMContentLoaded", () => {
    showActiveTheme(getPreferredTheme());

    document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const theme = toggle.getAttribute("data-bs-theme-value");
        setStoredTheme(theme);
        setTheme(theme);
        showActiveTheme(theme, true);
      });
    });
  });
})();
