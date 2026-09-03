/**
 * Code Connect for ButtonGroup — maps all four Figma sets to the one layout
 * component. `figma.children("*")` nests whatever Button(s) the group contains
 * (their own Code Connect renders them), so the snippet mirrors the real
 * composition. Validate names with `pnpm figma:check`.
 */
import figma from "@figma/code-connect";
import { ButtonGroup } from "@uds/ui";

const FILE = "https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z";

// The four [Button Group] sets share one layout-only component; only `direction`
// is a real prop. contentType is expressed by which children are present.
const SET_NODES = {
  cta: "17892-404602",
  bottomSheet: "654-108885",
  dialog: "654-108897",
  card: "654-108906",
} as const;

for (const nodeId of Object.values(SET_NODES)) {
  figma.connect(ButtonGroup, `${FILE}?node-id=${nodeId}`, {
    props: {
      direction: figma.enum("direction", { row: "row", column: "column" }),
    },
    example: ({ direction }) => (
      <ButtonGroup direction={direction}>{figma.children("*")}</ButtonGroup>
    ),
  });
}
