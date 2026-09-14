import Script from "next/script";

/**
 * The Google tag (gtag.js), for Google Ads and Analytics.
 *
 * The measurement ID is not a secret — it ships to every browser that loads
 * the page — so it lives here rather than in an environment variable, where
 * it would be one more invisible dashboard field to drift out of date.
 */
const GOOGLE_TAG_ID = "G-CBYY2Y4YW3";

/**
 * Production only, deliberately.
 *
 * A measurement property is only worth having if what it measures is real.
 * Loading the tag in development and on preview deployments would file every
 * local page reload, every QA sweep and every screenshot run as a visit from
 * a customer — and this repository's harnesses alone walk every route in
 * three languages, two themes and three viewports on each run, which would
 * comfortably outnumber the genuine traffic to a site this new.
 *
 * `VERCEL_ENV` is the same switch the canonical origin uses, so the two
 * answer to one definition of "this is the real site".
 */
export function GoogleTag() {
  if (process.env.VERCEL_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
        strategy="afterInteractive"
      />
      {/* Inline scripts need an id for Next to track and optimise them. */}
      <Script id="google-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_TAG_ID}');
        `}
      </Script>
    </>
  );
}
