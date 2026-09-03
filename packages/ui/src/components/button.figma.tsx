/**
 * Code Connect for Button — `@figma/code-connect` CLI source of truth.
 * Published with `figma connect publish`; `importPaths` rewrites the import to
 * `@uds/ui`. Figma property names are exact (incl. the ◐/◑/↔ glyph prefixes on
 * the icon props) — verified against the component sets. Validate: `pnpm figma:check`.
 */
import figma from "@figma/code-connect";
import { Button } from "@uds/ui";

const FILE = "https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z";

const icons = {
  iconStart: figma.boolean("◐ hasIcon-start", {
    true: figma.instance("↔ icon-start"),
    false: undefined,
  }),
  iconEnd: figma.boolean("◑ hasIcon-end", {
    true: figma.instance("↔ icon-end"),
    false: undefined,
  }),
} as const;

// [Button] Page — 55px page-level CTA (filled·ghost)
figma.connect(Button, `${FILE}?node-id=654-107975`, {
  props: {
    label: figma.string("text"),
    variant: figma.enum("variant", { filled: "filled", ghost: "ghost" }),
    hierarchy: figma.enum("hierarchy", { primary: "primary", secondary: "secondary" }),
    disabled: figma.boolean("isDisabled"),
    ...icons,
  },
  example: ({ label, variant, hierarchy, disabled, iconStart, iconEnd }) => (
    <Button category="page" variant={variant} hierarchy={hierarchy} disabled={disabled} iconStart={iconStart} iconEnd={iconEnd}>
      {label}
    </Button>
  ),
});

// [Button] Module — 44px module/content action (filled·outline·ghost, +tertiary on filled)
figma.connect(Button, `${FILE}?node-id=654-108042`, {
  props: {
    label: figma.string("text"),
    variant: figma.enum("variant", { filled: "filled", outline: "outline", ghost: "ghost" }),
    hierarchy: figma.enum("hierarchy", { primary: "primary", secondary: "secondary", tertiary: "tertiary" }),
    disabled: figma.boolean("isDisabled"),
    ...icons,
  },
  example: ({ label, variant, hierarchy, disabled, iconStart, iconEnd }) => (
    <Button category="module" variant={variant} hierarchy={hierarchy} disabled={disabled} iconStart={iconStart} iconEnd={iconEnd}>
      {label}
    </Button>
  ),
});

// [Button] Inline — 33px inline/text action (filled·outline·ghost)
figma.connect(Button, `${FILE}?node-id=654-108197`, {
  props: {
    label: figma.string("text"),
    variant: figma.enum("variant", { filled: "filled", outline: "outline", ghost: "ghost" }),
    hierarchy: figma.enum("hierarchy", { primary: "primary", secondary: "secondary" }),
    disabled: figma.boolean("isDisabled"),
    ...icons,
  },
  example: ({ label, variant, hierarchy, disabled, iconStart, iconEnd }) => (
    <Button category="inline" variant={variant} hierarchy={hierarchy} disabled={disabled} iconStart={iconStart} iconEnd={iconEnd}>
      {label}
    </Button>
  ),
});
