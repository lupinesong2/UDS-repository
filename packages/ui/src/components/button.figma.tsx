/**
 * Code Connect for Button — `@figma/code-connect` CLI source of truth.
 *
 * Published with `figma connect publish` (see root scripts). `importPaths` in
 * figma.config.json rewrites the import to `@uds/ui` in the generated snippet.
 *
 * NOTE: Figma property names below (variant/hierarchy/isDisabled/text/hasIcon-*)
 * must match the component-set's property panel exactly. Validate with
 * `pnpm figma:check` (dry-run) and adjust any that report as unknown.
 */
import figma from "@figma/code-connect";
import { Button } from "@uds/ui";

const FILE = "https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z";

// [Button] Page — 55px page-level CTA (filled·ghost)
figma.connect(Button, `${FILE}?node-id=654-107975`, {
  props: {
    label: figma.string("text"),
    variant: figma.enum("variant", { filled: "filled", ghost: "ghost" }),
    hierarchy: figma.enum("hierarchy", { primary: "primary", secondary: "secondary" }),
    disabled: figma.boolean("isDisabled"),
    iconStart: figma.boolean("hasIcon-start", { true: figma.instance("icon-start"), false: undefined }),
    iconEnd: figma.boolean("hasIcon-end", { true: figma.instance("icon-end"), false: undefined }),
  },
  example: ({ label, variant, hierarchy, disabled, iconStart, iconEnd }) => (
    <Button
      category="page"
      variant={variant}
      hierarchy={hierarchy}
      disabled={disabled}
      iconStart={iconStart}
      iconEnd={iconEnd}
    >
      {label}
    </Button>
  ),
});

// [Button] Module — 44px module/content action (filled·outline·ghost, +tertiary on filled)
figma.connect(Button, `${FILE}?node-id=654-108042`, {
  props: {
    label: figma.string("text"),
    variant: figma.enum("variant", { filled: "filled", outline: "outline", ghost: "ghost" }),
    hierarchy: figma.enum("hierarchy", {
      primary: "primary",
      secondary: "secondary",
      tertiary: "tertiary",
    }),
    disabled: figma.boolean("isDisabled"),
    iconStart: figma.boolean("hasIcon-start", { true: figma.instance("icon-start"), false: undefined }),
    iconEnd: figma.boolean("hasIcon-end", { true: figma.instance("icon-end"), false: undefined }),
  },
  example: ({ label, variant, hierarchy, disabled, iconStart, iconEnd }) => (
    <Button
      category="module"
      variant={variant}
      hierarchy={hierarchy}
      disabled={disabled}
      iconStart={iconStart}
      iconEnd={iconEnd}
    >
      {label}
    </Button>
  ),
});

// TODO: [Button] Inline — add its component-set node id, then:
// figma.connect(Button, `${FILE}?node-id=<INLINE_SET_ID>`, { ... category="inline" ... });
