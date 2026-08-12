import { Instrument_Serif, Inter, IBM_Plex_Sans_Arabic } from "next/font/google";

/**
 * Three faces, loaded as CSS variables and swapped by `[dir]` in globals.css.
 *
 * Instrument Serif is the voice of the brand — high contrast, narrow, editorial.
 * Inter carries every functional string. IBM Plex Sans Arabic covers both Arabic
 * and Kurdish Sorani (including ڕ ڵ ۆ ێ ڤ گ چ پ ژ), so RTL never falls back to a
 * face that was not drawn for the script.
 */

export const displayLatin = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display-latin",
  display: "swap",
  preload: true,
});

export const bodyLatin = Inter({
  subsets: ["latin"],
  variable: "--font-body-latin",
  display: "swap",
  preload: true,
  axes: [],
});

export const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-arabic",
  display: "swap",
  preload: false, // only pulled in on RTL routes
});

export const fontVariables = `${displayLatin.variable} ${bodyLatin.variable} ${arabic.variable}`;
