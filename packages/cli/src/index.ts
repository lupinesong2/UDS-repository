#!/usr/bin/env node
/**
 * uds — the UDS component CLI. Vendor-neutral (no shadcn dependency).
 *
 * Reads the UDS registry (the same JSON served at `/r/*.json`) and copies
 * component source into a consuming project.
 *
 *   uds list                                  list available components
 *   uds add button [--cwd .] [--registry …]   install a component
 *
 * `--registry` accepts a URL (https://host/r) or a local directory path.
 * Defaults to $UDS_REGISTRY, else the hosted registry.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const DEFAULT_REGISTRY = process.env.UDS_REGISTRY ?? "https://uds.example.com/r";

type RegistryFile = { target: string; content: string };
type RegistryItem = { name: string; title: string; dependencies: string[]; files: RegistryFile[] };

async function loadJson<T>(base: string, name: string): Promise<T> {
  const isUrl = /^https?:/.test(base);
  const src = isUrl ? `${base}/${name}.json` : resolve(join(base, `${name}.json`));
  if (isUrl) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`레지스트리 요청 실패: ${src} → ${res.status}`);
    return (await res.json()) as T;
  }
  return JSON.parse(await readFile(src, "utf8")) as T;
}

async function add(name: string, base: string, cwd: string) {
  if (!name) throw new Error("컴포넌트 이름이 필요합니다. 예: uds add button");
  const item = await loadJson<RegistryItem>(base, name);
  for (const file of item.files) {
    const dest = join(cwd, file.target);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, file.content, "utf8");
    console.log(`  + ${file.target}`);
  }
  console.log(`\n✓ "${item.name}" 설치 완료 (${item.files.length}개 파일)`);
  if (item.dependencies.length) {
    console.log(`  의존성 설치 필요: ${item.dependencies.join(" ")}`);
  }
}

async function list(base: string) {
  const index = await loadJson<{ items: RegistryItem[] }>(base, "index");
  console.log(`UDS 컴포넌트 (${index.items.length}):`);
  for (const it of index.items) console.log(`  - ${it.name}  —  ${it.title}`);
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const flags: Record<string, string> = {};
  const positional: string[] = [];
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a && a.startsWith("--")) {
      flags[a.slice(2)] = rest[i + 1] ?? "";
      i++;
    } else if (a) {
      positional.push(a);
    }
  }
  const base = flags.registry ?? DEFAULT_REGISTRY;
  const cwd = resolve(flags.cwd ?? process.cwd());

  if (cmd === "add") await add(positional[0] ?? "", base, cwd);
  else if (cmd === "list") await list(base);
  else {
    console.log("Usage: uds <add|list> [name] [--cwd <dir>] [--registry <url|path>]");
    process.exit(cmd ? 1 : 0);
  }
}

main().catch((err) => {
  console.error(`✗ ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
