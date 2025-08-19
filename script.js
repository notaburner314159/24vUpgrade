(function () {
  const STORAGE_KEY = "theme";
  const root = document.documentElement;

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    const cb = document.getElementById("themeCheck");
    if (cb) cb.checked = (theme === "dark");
  }

  // Initialize ASAP (before DOM) to reduce flash; checkbox sync happens on DOMContentLoaded
  const saved = localStorage.getItem(STORAGE_KEY);
  const systemDark = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
  apply(saved ?? (systemDark ? "dark" : "light"));

  function wire() {
    const cb = document.getElementById("themeCheck");
    if (!cb) {
      console.warn("[theme] #themeCheck not found.");
      return;
    }
    cb.addEventListener("change", () => {
      const next = cb.checked ? "dark" : "light";
      apply(next);
      localStorage.setItem(STORAGE_KEY, next);
    });

    // Follow system only if user hasn’t chosen manually
    if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").addEventListener) {
      matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) apply(e.matches ? "dark" : "light");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
