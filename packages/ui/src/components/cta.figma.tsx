/**
 * Code Connect for Cta — the screen-bottom action container. `onFrameHigh` is
 * the variant axis; `hasSystemUi-bottom` toggles the OS bottom bar. The action
 * (a ButtonGroup) nests via figma.children. Validate names with `pnpm figma:check`.
 */
import figma from "@figma/code-connect";
import { Cta } from "@uds/ui";

const FILE = "https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z";

figma.connect(Cta, `${FILE}?node-id=14942-51398`, {
  props: {
    onFrameHigh: figma.boolean("onFrameHigh"),
    hasSystemUiBottom: figma.boolean("hasSystemUi-bottom"),
  },
  example: ({ onFrameHigh, hasSystemUiBottom }) => (
    <Cta onFrameHigh={onFrameHigh} hasSystemUiBottom={hasSystemUiBottom}>
      {figma.children("*")}
    </Cta>
  ),
});
