// Theme lives on <html data-theme>, set before paint by the script in app/layout.js.

export const THEME_EVENT = "themechange";

export function getTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {}
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function toggleTheme() {
  setTheme(getTheme() === "light" ? "dark" : "light");
}

// For useSyncExternalStore
export function subscribeTheme(callback) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}
