"use client";

import { Button, type ButtonProps } from "@uds/ui";
import { PropsPlayground, type Control } from "../../../components/props-playground.tsx";

const controls: Control[] = [
  { name: "category", type: "select", options: ["page", "module", "inline"], default: "page" },
  { name: "variant", type: "select", options: ["filled", "outline", "ghost"], default: "filled" },
  {
    name: "hierarchy",
    type: "select",
    options: ["primary", "secondary", "tertiary"],
    default: "primary",
  },
  { name: "disabled", type: "boolean", default: false },
  { name: "children", type: "string", default: "레이블" },
];

export function ButtonPlayground() {
  return (
    <PropsPlayground
      componentName="Button"
      controls={controls}
      childrenProp="children"
      render={(props) => {
        // The playground exposes each axis independently; the real component
        // only accepts Figma-defined combinations, so cast the loose bag.
        const buttonProps = {
          category: props.category,
          variant: props.variant,
          hierarchy: props.hierarchy,
          disabled: props.disabled as boolean,
        } as ButtonProps;
        return <Button {...buttonProps}>{String(props.children)}</Button>;
      }}
    />
  );
}
