"use client";

import { useEffect } from "react";

/**
 * Tells the document that React got here.
 *
 * The head script (see `ThemeScript`) sets `data-js` and then waits. If this
 * component never mounts — a blocked or failed bundle, an extension, an error
 * thrown during hydration — the flag is dropped and the scroll reveals stop
 * hiding their content, so the page reads as un-animated rather than as empty.
 *
 * It renders nothing and is mounted once, in the site layout.
 */
export function Hydrated() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "";
  }, []);
  return null;
}
