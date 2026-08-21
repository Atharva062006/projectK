import type { NextConfig } from "next";

const leafygreenPackages = [
  "@leafygreen-ui/leafygreen-provider",
  "@leafygreen-ui/button",
  "@leafygreen-ui/text-input",
  "@leafygreen-ui/password-input",
  "@leafygreen-ui/card",
  "@leafygreen-ui/badge",
  "@leafygreen-ui/banner",
  "@leafygreen-ui/typography",
  "@leafygreen-ui/icon",
  "@leafygreen-ui/icon-button",
  "@leafygreen-ui/menu",
  "@leafygreen-ui/modal",
  "@leafygreen-ui/pagination",
  "@leafygreen-ui/text-area",
  "@leafygreen-ui/select",
  "@leafygreen-ui/combobox",
  "@leafygreen-ui/chip",
  "@leafygreen-ui/tabs",
  "@leafygreen-ui/loading-indicator",
  "@leafygreen-ui/empty-state",
  "@leafygreen-ui/confirmation-modal",
  "@leafygreen-ui/palette",
  "@leafygreen-ui/tokens",
  "@leafygreen-ui/emotion",
  "@leafygreen-ui/table",
  "@leafygreen-ui/avatar",
  "@leafygreen-ui/callout",
  "@leafygreen-ui/expandable-card",
  "@leafygreen-ui/checkbox",
  // Internal LG packages (peer-installed transitively)
  "@leafygreen-ui/lib",
  "@leafygreen-ui/hooks",
  "@leafygreen-ui/a11y",
  "@leafygreen-ui/popover",
  "@leafygreen-ui/polymorphic",
  "@leafygreen-ui/portal",
  "@leafygreen-ui/input-option",
  "@leafygreen-ui/form-field",
  "@leafygreen-ui/descendants",
];

const nextConfig: NextConfig = {
  // Required: LeafyGreen uses Emotion CSS-in-JS, which ships ESM-only
  // code that Next.js SSR can't handle without explicit transpilation.
  transpilePackages: leafygreenPackages,
};

export default nextConfig;
