---
name: uds-code-connect
description: Connect UDS code components to their Figma component sets via Figma Code Connect, publish with the CLI (v2 templates), and keep the docs status page in sync. Trigger when the user says "code connect", "코드 커넥트", "피그마랑 연결", "connect this component to Figma", "publish code connect", "Dev Mode에 코드 보이게", or asks to map/link a built component to its Figma node.
---

# UDS Code Connect (code ↔ Figma)

Code Connect makes Figma **Dev Mode** show a real code snippet + GitHub source for
a design component. It is a **mapping/reference**, NOT a sync engine — it does not
change your code when the design changes, and it does not generate components.
Each mapping is one small file per Figma component **set**.

The durable, CI-friendly approach is the **`@figma/code-connect` v2 CLI with
template files (`*.figma.ts`)** published from the repo (the repo is the source of
truth). There is also a quick **MCP** path (no token) — good for one-off mapping in
a session, but the mappings then live only in Figma. Prefer the CLI for anything
lasting.

---

## 0. Prerequisites (mostly one-time, user-side)

- **Figma plan**: Code Connect needs **Organization/Enterprise**. (If MCP
  `send_code_connect_mappings` ever succeeded, the plan is already fine.)
- **Figma for GitHub app**: installed and **granted access to the repo**. A
  **personal** GitHub account is fine (no GitHub org needed); a **private** repo is
  fine and free — just grant the app access to that repo. ("Organization" in the
  Figma prompt refers to the *Figma* plan, not a GitHub org.)
- **Repo pushed to GitHub** so `source=` links resolve.
- Node ≥ 25: corepack `pnpm` may crash (`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`)
  — use `~/.local/bin/pnpm` or `node_modules/.bin/figma` directly.

## 1. Token handling (security-critical)

The CLI authenticates with a **Figma personal access token**. Scopes:
**`file_code_connect` = Write** and **`file_content` = Read** (everything else
No access). Least privilege — MCP/canvas workflows do NOT use this token, so don't
add scopes "for the future".

Store it in **`.env`** (already gitignored) as `FIGMA_ACCESS_TOKEN=...`. Then:

- **NEVER `source .env`** — a malformed line makes the shell execute the token and
  it lands in the transcript/logs (this happened once; the token had to be
  revoked). Extract the value only, stripping quotes/CR:

```bash
export FIGMA_ACCESS_TOKEN="$(sed -n 's/^FIGMA_ACCESS_TOKEN=[[:space:]]*//p' .env | tr -d '\r' | sed -e 's/^["'\'']//' -e 's/["'\'']$//')"
```

- **Always redact** any command output that could echo a token:
  `... 2>&1 | sed -E 's/figd_[A-Za-z0-9_-]+/figd_***REDACTED***/g'`
- If a token is ever printed, tell the user to **revoke + reissue** immediately.
- Diagnose a bad token WITHOUT printing it: `printf 'len=%s prefix=%s\n' "${#T}" "${T:0:5}"` (a valid token is `figd_` + ~40 chars; leading `"`/trailing char-code 34 means it was quoted → 403 Invalid token).

## 2. Discover node ids + exact property names

Use `list_file_components_for_code_connect(fileKey)` (MCP) — returns every
published set with node ids and **exact property names**. Property names include
glyph prefixes that MUST be matched verbatim:

- `◐ hasIcon-start`, `◑ hasIcon-end`, `↔ icon-start`, `↔ icon-end`, `◒ hasSystemUi-bottom`, `<-> systemUi`
- plain: `text`, `variant`, `hierarchy`, `isDisabled`, `direction`, `contentType`, `onFrameHigh`

(Output can be huge — grep the saved tool-result file for the set names instead of
loading it all.)

## 3. Author one `*.figma.ts` template per set node

```ts
// packages/ui/src/components/button-page.figma.ts
import figma from "figma";                              // the template runtime (not a real import)

const label = figma.selectedInstance.getString("text");
const variant = figma.selectedInstance.getEnum("variant", { filled: "filled", ghost: "ghost" });
const disabled = figma.selectedInstance.getBoolean("isDisabled");
const iconStart = figma.selectedInstance.getBoolean("◐ hasIcon-start", {
  true: figma.selectedInstance.getInstanceSwap("↔ icon-start")?.executeTemplate().example,
  false: undefined,
});

export default {
  id: "Button",
  imports: ["import { Button } from '@uds/ui';"],       // shown atop the Dev Mode snippet
  example: figma.code`<Button category="page"${figma.helpers.react.renderProp("variant", variant)}${figma.helpers.react.renderProp("disabled", disabled)}${figma.helpers.react.renderProp("iconStart", iconStart)}>${figma.helpers.react.renderChildren(label)}</Button>`,
  metadata: { nestable: true },
};
```

- **One file per set node** (e.g. Button → `button-page/module/inline.figma.ts`).
- **Composition components** (ButtonGroup, Cta): render `{figma.children("*")}` and
  set `metadata: { nestable: true }` so nested instances resolve to *their* mappings.
- Hardcode the category/context in the example (it's fixed per set).
- Name files descriptively (not the migrate defaults `_1`/`_2`).

## 4. Config + scripts (one-time)

```jsonc
// figma.config.json (repo root) — v2 templates, no `parser` field
{ "codeConnect": { "include": ["packages/ui/src/components/**/*.figma.ts"] } }
```

- `packages/ui/tsconfig.json` → `"exclude": ["**/*.figma.ts", "**/*.figma.tsx"]`
  (they import the `figma` template runtime, not app code — must not hit `tsc`).
- root `package.json` devDep `@figma/code-connect` (v2) + scripts:
  `"figma:check": "figma connect publish --dry-run"`, `"figma:publish": "figma connect publish"`.

## 5. Validate → publish

```bash
export FIGMA_ACCESS_TOKEN="$(sed -n 's/^FIGMA_ACCESS_TOKEN=[[:space:]]*//p' .env | tr -d '\r' | sed -e 's/^["'\'']//' -e 's/["'\'']$//')"
pnpm figma:check                    # dry-run → expect "All Code Connect files are valid"
pnpm figma:publish -- --force       # --force overwrites prior (e.g. MCP-created) mappings
```

Publishing makes the repo `*.figma.ts` the single source of truth. `--force` is
needed when earlier mappings (MCP "UI-created") exist for the same nodes.

## 6. Migrating parser (v1) → templates (v2)

If `.figma.tsx` parser files exist (v1), the CLI v2 rejects them ("framework
parsers no longer supported"). Migrate:

```bash
node_modules/.bin/figma connect migrate      # .figma.tsx → .figma.ts templates (needs token)
```

Then: rename the auto-named `foo_1.figma.ts` / `foo_2.figma.ts` outputs
descriptively, **delete the old `.figma.tsx`**, and remove `"parser"` + component-
source globs from `figma.config.json` (templates are self-contained).

## 7. Docs status page (separate)

The `/code-connect` docs page is generated from a snapshot, independent of publish:
- `apps/docs/scripts/code-connect-map.json` — fetched via MCP `get_code_connect_map`
- `apps/docs/scripts/build-code-connect.ts` — cross-references a manifest → `mappings.generated.ts`

When mappings live in the repo as `*.figma.ts`, this fetch step CAN be replaced by
scanning the `*.figma.ts` files directly (each file's `// url=...node-id=` + `// component=`
header = one connected mapping) → fully CI-automatable, no MCP/token. Offer this as
the automation step.

---

## Troubleshooting (things that actually bit us)

| Symptom | Cause → Fix |
|---|---|
| `403 Invalid token` | Token quoted in `.env` (extraction kept the quotes), revoked, or wrong scope. Strip quotes (§1); confirm `file_code_connect`=Write. |
| Token printed in output | `source .env` executed a bad line. Use value-extraction (§1) + redact `figd_`. **Revoke + reissue.** |
| `framework parsers no longer supported` | CLI v2 + `.figma.tsx` parser files. Migrate to templates (§6). |
| `second argument to figma.connect() must be a string literal` | v1 parser needs a literal URL (no `${...}`/loops). (v2 templates don't use `figma.connect`.) |
| `Import for X could not be resolved` | v1: add component sources to `include` or import relatively; v2 templates avoid this (self-contained `imports`). |
| `Using "html" parser` warning on publish | Harmless for template files — they validate regardless. |
| pnpm crashes on Node ≥ 25 | `~/.local/bin/pnpm` or `node_modules/.bin/figma`. |

## Checklist

- [ ] Prereqs: Org/Enterprise Figma, Figma-for-GitHub app granted on the repo, repo pushed.
- [ ] Token in `.env` (gitignored), scopes `file_code_connect`(W)+`file_content`(R); never sourced/echoed; output redacted.
- [ ] One descriptively-named `*.figma.ts` template per set node; exact glyph property names; composition uses `figma.children("*")` + `nestable`.
- [ ] `figma.config.json` templates-only include; `*.figma.ts(x)` excluded from tsc.
- [ ] `figma:check` valid → `figma:publish -- --force`.
- [ ] `.env` NOT committed; CLI output showed no raw token.
