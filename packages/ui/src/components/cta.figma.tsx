/**
 * Code Connect for Cta — screen-bottom action container. `onFrameHigh` is the
 * variant axis; `◒ hasSystemUi-bottom` toggles the OS bottom bar. The action
 * (a ButtonGroup) nests via figma.children. v1 parser: literal URL, inline props.
 */
import figma from "@figma/code-connect";
import { Cta } from "./cta";

figma.connect(Cta, "https://www.figma.com/design/spWdVkr7RbwWOyDG6xbY4z?node-id=14942-51398", {
  props: {
    onFrameHigh: figma.enum("onFrameHigh", { true: true, false: false }),
    hasSystemUiBottom: figma.boolean("◒ hasSystemUi-bottom"),
  },
  example: ({ onFrameHigh, hasSystemUiBottom }) => (
    <Cta onFrameHigh={onFrameHigh} hasSystemUiBottom={hasSystemUiBottom}>
      {figma.children("*")}
    </Cta>
  ),
});
