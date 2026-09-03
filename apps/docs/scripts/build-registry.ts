/**
 * Builds the distributable registry:
 *   apps/docs/public/r/<name>.json   — one shadcn registry-item per component
 *   apps/docs/public/r/index.json    — the registry index (all items)
 *
 * Component source lives in `packages/ui/src` and imports siblings with
 * relative, extensioned paths (monorepo-friendly). Here we normalize those to
 * the shadcn `@/` alias so `npx shadcn add` drops working files into any app.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { registry, type RegistryItem } from "../../../registry/registry.ts";

const here = dirname(fileURLToPath(import.meta.url));
const uiSrc = join(here, "..", "..", "..", "packages", "ui", "src");
const iconsSrc = join(here, "..", "..", "..", "packages", "icons", "src");
const outDir = join(here, "..", "public", "r");

const srcBase = { ui: uiSrc, icons: iconsSrc } as const;

/** Rewrite monorepo-relative + workspace imports to the shadcn `@/` alias. */
function normalizeImports(code: string): string {
  return code
    .replace(/(["'])\.{1,2}\/lib\/utils(\.ts)?\1/g, '"@/lib/utils"')
    .replace(/(["'])@uds\/icons\1/g, '"@/components/ui/icons"')
    .replace(/(["'])\.\/([a-z-]+)\.tsx?\1/g, '"@/components/ui/$2"');
}

function buildItem(item: RegistryItem) {
  const files = item.files.map((f) => {
    const raw = readFileSync(join(srcBase[f.pkg ?? "ui"], f.src), "utf8");
    return {
      path: f.target,
      target: f.target,
      type: f.type,
      content: normalizeImports(raw),
    };
  });

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
    files,
    ...(item.meta ? { meta: item.meta } : {}),
  };
}

mkdirSync(outDir, { recursive: true });

const items = registry.map(buildItem);
for (const item of items) {
  writeFileSync(join(outDir, `${item.name}.json`), JSON.stringify(item, null, 2));
  console.log(`✓ r/${item.name}.json`);
}

const index = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "uds",
  homepage: "https://uds.example.com",
  items: items.map(({ name, type, title, description, dependencies }) => ({
    name,
    type,
    title,
    description,
    dependencies,
  })),
};
writeFileSync(join(outDir, "index.json"), JSON.stringify(index, null, 2));
console.log(`✓ r/index.json (${items.length} items)`);
