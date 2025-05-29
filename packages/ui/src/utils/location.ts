import { isBrowser } from "@qwik.dev/core";

export function getCurrentLocation() {
  if (!isBrowser) return "";

  if (window.location.pathname === "/") return "/";

  return window.location.pathname.slice(0, -1);
}
