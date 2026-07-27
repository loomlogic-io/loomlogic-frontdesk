"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/*
 * The server snapshot is `true` so server-rendered markup assumes the
 * accessible default. Every motion primitive is therefore inert until the
 * client confirms motion is welcome.
 */
function getServerSnapshot() {
  return true;
}

/** Shared reduced-motion signal for the public motion primitives. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
