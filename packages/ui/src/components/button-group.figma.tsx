/**
 * Code Connect for ButtonGroup — the four Figma sets map to one layout-only
 * component. `figma.children("*")` nests the connected child Button(s) so the
 * snippet mirrors the real composition. v1 parser: literal URLs, one call each.
 */
import figma from "@figma/code-connect";
import { ButtonGroup } from "./button-group";

// [Button Group] CTA
figma.connect(ButtonGroup, "https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z?node-id=17892-404602", {
  props: { direction: figma.enum("direction", { row: "row", column: "column" }) },
  example: ({ direction }) => <ButtonGroup direction={direction}>{figma.children("*")}</ButtonGroup>,
});

// [Button Group] Bottom Sheet
figma.connect(ButtonGroup, "https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z?node-id=654-108885", {
  props: { direction: figma.enum("direction", { row: "row", column: "column" }) },
  example: ({ direction }) => <ButtonGroup direction={direction}>{figma.children("*")}</ButtonGroup>,
});

// [Button Group] Dialog
figma.connect(ButtonGroup, "https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z?node-id=654-108897", {
  props: { direction: figma.enum("direction", { row: "row", column: "column" }) },
  example: ({ direction }) => <ButtonGroup direction={direction}>{figma.children("*")}</ButtonGroup>,
});

// [Button Group] Card
figma.connect(ButtonGroup, "https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z?node-id=654-108906", {
  props: { direction: figma.enum("direction", { row: "row", column: "column" }) },
  example: ({ direction }) => <ButtonGroup direction={direction}>{figma.children("*")}</ButtonGroup>,
});
