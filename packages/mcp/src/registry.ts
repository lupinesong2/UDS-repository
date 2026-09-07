import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type RegistryFile = { target: string; content: string; type: string };
export type RegistryItem = {
  name: string;
  title: string;
  description: string;
  dependencies: string[];
  files: RegistryFile[];
  meta?: { ai?: string[] };
};

const here = dirname(fileURLToPath(import.meta.url));
/** In-repo default; overridable with $UDS_REGISTRY (URL or dir). */
const LOCAL_DEFAULT = resolve(here, "..", "..", "..", "apps", "docs", "public", "r");

export function registryBase(): string {
  return process.env.UDS_REGISTRY ?? LOCAL_DEFAULT;
}

/** Sibling of the registry: `.../public/r` → `.../public/examples` (URL or dir). */
export function examplesBase(): string {
  return registryBase().replace(/([\\/])r$/, "$1examples");
}

async function loadFrom<T>(base: string, name: string): Promise<T> {
  const isUrl = /^https?:/.test(base);
  if (isUrl) {
    const res = await fetch(`${base}/${name}.json`);
    if (!res.ok) throw new Error(`${base}/${name} → ${res.status}`);
    return (await res.json()) as T;
  }
  return JSON.parse(await readFile(join(base, `${name}.json`), "utf8")) as T;
}

export const loadJson = <T>(name: string): Promise<T> => loadFrom<T>(registryBase(), name);
export const loadExample = <T>(name: string): Promise<T> => loadFrom<T>(examplesBase(), name);
