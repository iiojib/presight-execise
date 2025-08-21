let mode = localStorage["darkMode"] !== undefined ? localStorage["darkMode"] === "true" : null;

if (mode === null) {
  mode = window.matchMedia("(prefers-color-scheme: dark)").matches;
}

document.documentElement.classList.toggle("dark", mode);
