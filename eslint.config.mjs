import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// Next 16 dropped `next lint`; this is the ESLint CLI setup its docs give
// (node_modules/next/dist/docs/01-app/03-api-reference/05-config/03-eslint.md).
const eslintConfig = defineConfig([
  ...nextVitals,
  {
    // The dashboard's "Cancel" links are plain anchors on purpose: a full load
    // throws away a half-edited form, where a client navigation could keep
    // its stale uncontrolled inputs.
    files: ["src/app/(admin)/**", "src/components/admin/**"],
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
