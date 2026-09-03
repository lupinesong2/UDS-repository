---
name: uds-component
description: Build or merge a UDS component in packages/ui from a Figma component set, then generate its registry entry and shadcn-format docs page with the Preview/Code playground. Trigger whenever the user pastes a figma.com component URL to build/add/merge a component (even the link alone), or says "컴포넌트/버튼 합치자", "Figma 컴포넌트 추가", "registry 등록", "컴포넌트 문서 만들어".
---

# UDS Component Authoring (Figma → packages/ui → registry → docs)

This skill reproduces, precisely and repeatably, the way UDS components are
built from Figma: one `cva` component, props typed so **only Figma-defined
combinations compile**, tokens bound to Figma variables, a registry entry, and a
shadcn-format docs page with a unified **Preview/Code** playground card.

Follow the phases in order. Do not skip verification.

---

## Invocation & inputs

**The only required input is a Figma component-set URL.** The user may just paste
a `figma.com/design/<fileKey>/...?node-id=<id>` link (optionally "만들어줘" /
"추가" / "합치자") — that alone triggers this skill; typing `/uds-component` is
optional.

From the link alone, proceed autonomously:

1. Extract the node id from the URL (`?node-id=1-2` → `1:2` or `1-2`) and run
   Phase 1 to read the set.
2. **Derive the component name** from the Figma set name — `[Button] Inline` →
   `button`, `[Chip] …` → `chip`, etc. If several sets share a prefix (Page /
   Module / Inline), merge them into ONE component with a `category` axis
   (see `button.tsx`). Only ask the user when the name or the category mapping is
   genuinely ambiguous; otherwise pick the obvious mapping and state it.
3. Decide new-vs-merge: if a component of that name already exists in
   `packages/ui/src/components/`, extend/merge it; else create it.
4. Run Phases 1–7 end to end, then report every file created/updated/deleted and
   the typecheck result.

Do not stop to confirm each phase — only pause for a real decision (ambiguous
name, a token missing from `theme.css`, or a Figma combo that contradicts an
existing one).

---

## 0. Repo map (source of truth)

| Concern | Path |
|---|---|
| Component source | `packages/ui/src/components/<name>.tsx` |
| Barrel export | `packages/ui/src/index.ts` |
| `cn` util | `packages/ui/src/lib/utils.ts` |
| Token utilities (generated) | `packages/tokens/dist/theme.css` |
| Registry manifest | `registry/registry.ts` |
| Registry build script | `apps/docs/scripts/build-registry.ts` → emits `apps/docs/public/r/<name>.json` + `index.json` |
| Docs page | `apps/docs/app/components/<name>/page.tsx` |
| Docs playground | `apps/docs/app/components/<name>/<name>-playground.tsx` |
| Shared playground | `apps/docs/components/props-playground.tsx` (Preview/Code tab card) |
| Sidebar nav | `apps/docs/app/layout.tsx` (`NAV` array) |

Also honor `/.claude/rules/figma-mcp-integration.md` (canvas-write rules) — but
this skill is **code in the repo**, not Figma canvas writes.

---

## 1. Extract the Figma spec

Load `figma:figma-implement-design` first (required before `get_design_context`).
The core component library file is **`spWdVkr7RbwWOyDG6xbY4z`** ("[Test] Core
Component v.1.0.0"). Given a node URL/id, call in this order:

1. `mcp__figma__get_screenshot` — visual truth (row = variant×hierarchy, col = state).
2. `mcp__figma__get_metadata` — the component-set axes. Symbol names encode them,
   e.g. `variant=outline, hierarchy=secondary, state=focused, isDisabled=true`.
   Record height (each symbol's height) and which `variant × hierarchy` combos
   actually exist — **this defines the allowed type union**.
3. `mcp__figma__get_variable_defs` — the bound tokens (colors, spacing, radius, font).
4. `mcp__figma__get_design_context` — confirm exact token bindings per variant,
   especially the *default-state background* of each `filled` combo (categories
   differ, e.g. inline `filled/primary` = `container/brand/secondary` while
   module `filled/primary` = `container/brand/primaryHigh`).

Write down, per combo: bg, text color, border (outline), pressed overlay
(`state/stateLayer/pressed-*`), disabled (container/border/text).

## 2. Verify every token utility exists

Never hardcode colors/spacing. Confirm each Tailwind utility resolves against the
generated theme before using it:

```bash
CSS=packages/tokens/dist/theme.css
grep -oE "component-(x|y)-[0-9]+" "$CSS" | sort -u      # spacing/component/*
grep -oE "text-label-(large|medium|small)" "$CSS" | sort -u
grep -E -- "--color-<token>:" "$CSS"                    # e.g. --color-container-brand-secondary:
```

Token → utility mapping: `color/container/brand/secondary` → `bg-container-brand-secondary`,
`color/text/base/white` → `text-text-base-white`, `color/border/base/higher` →
`border-border-base-higher`, `spacing/component/x/12` → `px-component-x-12`,
`font/label/medium` → `text-label-medium`, `radius/small` → `rounded-small`,
`spacing/gap/4` → `gap-gap-4`, `color/state/stateLayer/pressed-inverseBlack` →
`before:bg-state-state-layer-pressed-inverse-black`.

## 3. Author the component (`packages/ui/src/components/<name>.tsx`)

**Structure — mirror `button.tsx`:**

- `cva([...base], { variants, compoundVariants, defaultVariants })`.
- Base: `relative isolate inline-flex select-none items-center justify-center`,
  `gap-gap-4 rounded-small font-sans font-base leading-none transition-colors`,
  the `focus-visible:` ring, `disabled:pointer-events-none [&_svg]:shrink-0`, and
  the `before:` state-layer overlay (`hover:before:opacity-100 active:before:opacity-100`).
- **Geometry/typography live on a category-like axis** (padding + text size +
  `[&_svg]:size-*`). **Colors live only in `compoundVariants`**, keyed by the
  axes that actually differ. If a combo has a single style regardless of an axis
  (e.g. page `ghost` only has secondary), omit that axis in the compound entry so
  the cva default still matches.
- `defaultVariants` set the most common combo (page/filled/primary shape).

**Props = Figma-defined-only discriminated union (the key rule):**

Do NOT expose `VariantProps<typeof cva>` (it allows every axis independently).
Instead hand-write a union so invalid combos are compile errors:

```ts
type XVariantProps =
  | { category?: "page"; variant?: "filled"; hierarchy?: "primary" | "secondary" }
  | { category?: "page"; variant: "ghost"; hierarchy?: "secondary" }
  | { category: "module"; variant?: "filled"; hierarchy?: "primary" | "secondary" | "tertiary" }
  | { category: "module"; variant: "outline" | "ghost"; hierarchy?: "primary" | "secondary" }
  | { category: "inline"; variant?: "filled" | "outline" | "ghost"; hierarchy?: "primary" | "secondary" };

export type XProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean; iconStart?: React.ReactNode; iconEnd?: React.ReactNode;
} & XVariantProps;
```

- The **default category is optional** (`category?: "page"`) so `<X>` alone works.
- Requiring a variant in a branch (`variant: "ghost"`) narrows the allowed
  hierarchy for that branch.
- **No runtime fallbacks** for undefined combos — if Figma doesn't define it, it
  doesn't exist in the type OR the compoundVariants (an unmatched combo renders
  unstyled, which is correct: it should have been a type error).
- Component body: `forwardRef`, `Slot` when `asChild`, render `{iconStart}{children}{iconEnd}`.
- Export `{ X, xVariants }` and `export type XProps`.

Update `packages/ui/src/index.ts`. When merging components, delete the absorbed
file and remove its exports.

**Layout-only / composition components (doc-only merge):** some sets are pure
*layout* wrappers that delegate all color/size to composed children (e.g.
`ButtonGroup` arranges `Button`s; its `[Button Group] CTA/Bottom Sheet/Dialog/Card`
sets differ only in which child `Button` you pass). When a new Figma set maps 1:1
onto such an existing component and differs **only** in child composition — no new
layout axis, every child style already expressible with existing components
(verify each token resolves to an existing variant's utility) — do a **doc-only
merge**: update the component docstring, `registry` `description`/`meta.ai`, and
the docs page to cover the new set; do **not** add a no-op prop/axis. Only add a
real axis when it changes styling the wrapper itself owns. State this mapping in
the report.

**New layout containers (not button-like):** a container component (e.g. `Cta` —
a screen-bottom action area with an `onFrameHigh` background axis + optional
system-UI slot + `children`) is NOT interactive, so skip the button base
(focus ring, state-layer `before:`, `inline-flex`). Use a **minimal `cva`** for
just the axis it owns (e.g. background), keep booleans/slots as plain props, and
compose the real action via `children` (put a `ButtonGroup` inside). OS-spec
geometry (e.g. iOS home-indicator 5px/134px) may stay literal, but its **color
must still bind to a token**.

## 4. Registry (`registry/registry.ts`) + rebuild

Add/merge one `RegistryItem`: `name`, `title`, `description`, `dependencies`
(`@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`),
`files` (the component + `lib/utils.ts`), and `meta.ai` guidance. The `meta.ai`
lines must state that **only Figma-defined combinations are valid (enforced by
types)** and list them per category. Then rebuild:

```bash
node apps/docs/scripts/build-registry.ts   # emits public/r/<name>.json + index.json
```

Delete `apps/docs/public/r/<removed>.json` for any merged-away component.

## 5. Docs page — shadcn format

`apps/docs/app/components/<name>/page.tsx`. Section order:

1. **Header** — kicker `Components`, `h1` (`text-3xl font-bold tracking-tight`),
   one-paragraph `text-lg` muted description referencing the Figma set(s).
2. **Hero playground** — `<XPlayground />` right under the header (the combined
   preview + props + code card). A short caption noting the controls mirror the
   Figma component-set properties is welcome.
3. **Installation** — `### CLI` (`npx @uds/cli add <name>`) + `### Manual · MCP`
   (the `mcpServers` JSON).
4. **Usage** — `import` line + a minimal `<X …>` snippet, in `CodeBlock`.
5. **Examples** *(optional)* — omit when the hero playground already reproduces
   every Figma variation (the default for most components). Include only when a
   static matrix adds something the playground can't show; then use one `Preview`
   surface per category (`variant × hierarchy`), plus `### Icon` / `### States`.
6. **API Reference** — a table of **all** props, each tagged with an **Origin**
   badge (see below) + a legend. Include a note that undefined combos are compile
   errors (name a concrete example).
7. **Design Tokens** — table mapping usage → Figma token → value.
8. **AI 가이드** — a **table** (`분류` | `가이드`), one row per rule, driven by an
   `AI_GUIDE: { category, rule }[]` array (mirror `meta.ai`'s `[분류]` prefixes).
   Pick categories that fit the component (e.g. 구조 · 콘텐츠 · 맥락 · 색상·토큰).

### Typography (shadcn doc scale)

Match the shadcn docs scale — don't oversize headings:

- `h1` page title → `text-3xl font-bold tracking-tight`
- `H2` section → `mt-12 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0`
- `H3` subsection → `mt-8 text-xl font-semibold tracking-tight`
- lead description → `text-lg text-text-base-tertiary`; body/helper → `text-sm text-text-base-tertiary`

### Prop Origin (Figma / Code / Both)

Every prop in the API Reference is classified by where it "lives":

- **Figma** — a Figma component-set property only; in code it's expressed via
  children/other props, not a real prop (e.g. `contentType`, a `context`/set).
- **Code** — a code-only prop with no Figma equivalent (`children`, `className`,
  `…HTMLAttributes`).
- **Both** — a real prop shared by Figma and code (e.g. `direction`).

Render each with an outline chip whose border+text share `currentColor`:

```tsx
function OriginBadge({ origin }: { origin: "figma" | "code" | "both" }) {
  const map = {
    figma: { label: "Figma", cls: "text-text-brand-primary-high" },
    code: { label: "Code", cls: "text-text-base-tertiary" },
    both: { label: "Both", cls: "text-text-base-primary" },
  } as const;
  const { label, cls } = map[origin];
  return (
    <span className={`inline-flex items-center rounded-full border border-current px-2 py-0.5 text-[10px] font-medium ${cls}`}>
      {label}
    </span>
  );
}
```

List props in **Figma property order** (match the Figma variant-name order, e.g.
`direction` before `contentType`), then the Code-only props.

Local helpers to reuse: `H2`, `H3`, `OriginBadge`, `GuideGroup`, and `Preview`
(only if Examples are included). Because props are a strict union, **data-driven**
`<X>` in `.map()` needs a cast helper:

```ts
function demo(category: string, variant?: string, hierarchy?: string): XProps {
  return { category, variant, hierarchy } as XProps;   // static tables are known-valid
}
```

Literal-prop usages (`<X category="inline" variant="ghost" hierarchy="primary" />`)
stay fully type-checked — keep those un-cast so the doc self-verifies.

Add the component to `NAV` in `apps/docs/app/layout.tsx`; delete merged-away nav
items and their `app/components/<removed>/` dirs.

## 6. Playground (`<name>-playground.tsx`)

`"use client"`. The control panel must **mirror the Figma component-set
properties** — one `select` per Figma property (plus a `context`/set select when
one component merges several Figma sets), in **Figma property order** — so a user
can reproduce every variation Figma defines, and *only* those.

**Controls (`controls: Control[]`)**

- Order the controls to match Figma (e.g. `context`, then `direction`, then
  `contentType`).
- **Dependent dropdowns:** a select's `options` may be a function of the current
  state — `options: (s) => string[]` — so downstream menus only show what the
  upstream selection actually defines. Impossible combinations must never be
  selectable (e.g. `Dialog · filled+outline`, or `filled+ghost · row`).
  `PropsPlayground` cascade-normalizes state after every change (processing
  controls in declared order), so put the driving axis first.

```tsx
const controls: Control[] = [
  { name: "context", type: "select", options: ["CTA", "Bottom Sheet", "Dialog", "Card"], default: "CTA" },
  { name: "direction", type: "select", options: ["row", "column"], default: "row" },
  { name: "contentType", type: "select",
    options: (s) => CONTENT_BY_CONTEXT[s.context as Ctx].filter((ct) => ORIENTATION[ct] === s.direction),
    default: "filled+filled" },
];
```

**Preview** — `render` builds the real thing. For composition components, map the
(Figma) selection to the actual child composition; for single components, cast the
loose bag to the strict props and spread it:

```tsx
render={(props) => {
  const p = { category: props.category, variant: props.variant,
    hierarchy: props.hierarchy, disabled: props.disabled as boolean } as XProps;
  return <X {...p}>{String(props.children)}</X>;
}}
```

**Code** — the Code tab must reflect the **real source structure**, not a generic
prop bag. Pass a `code: (state) => string` override that emits exactly what a
developer would write (for composition components, the `<Wrapper>` + children
tree). Drive both `render` and `code` from the same mapping so they never drift.

The shared `PropsPlayground` renders one bordered card with a **Preview / Code**
tab bar: Preview = live component (left) + prop controls (right); Code = the
`code(state)` output (or the generic generator when no override) + copy button.
Do **not** fork it per page — extend it additively only. Its stable API is
`componentName`, `controls` (with static **or** `(state) => string[]` options),
`childrenProp`, `render`, and the optional `code` override.

## 7. Verify (mandatory)

`pnpm typecheck` is canonical, but **corepack pnpm crashes on Node ≥ 25**
(`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`). Fallback — run the workspace TS
compiler directly (v7 / tsgo):

```bash
TSC="$(pwd)/node_modules/.pnpm/typescript@7.0.2/node_modules/typescript/bin/tsc"
node "$TSC" --noEmit -p packages/ui/tsconfig.json && echo ui-ok
rm -rf apps/docs/.next/types   # stale generated validator references deleted pages
node "$TSC" --noEmit -p apps/docs/tsconfig.json && echo docs-ok
```

(The typescript version folder may differ — resolve it with
`find . -path "*/typescript/bin/tsc"`.)

**Negative type test** — prove the union rejects non-Figma combos. Drop a temp
file into `packages/ui/src/`, typecheck, confirm the invalid lines error, then
delete it:

```tsx
// packages/ui/src/__typetest__.tsx
import { X } from "./index.ts";
const ok = <X category="module" variant="outline" hierarchy="secondary" />;
const bad = <X category="page" variant="outline" />;      // MUST error
```

Expect `TS2322 … is not assignable` on every intentionally-invalid line, none on
the valid ones. Remove the temp file.

## 8. (Optional) Code Connect

To link the new component's Figma set(s) to this code so Dev Mode shows the
snippet + GitHub source, use the **`uds-code-connect`** skill — it covers the full
v2 template workflow (`*.figma.ts`), token hygiene, publish, and the docs status
page. In brief: author one `*.figma.ts` template per set node (import from `@uds/ui`,
map exact Figma prop names incl. glyph prefixes, `figma.children("*")` for
composition), then `pnpm figma:check` → `pnpm figma:publish -- --force`.

---

## Checklist

- [ ] Figma metadata read; allowed `variant × hierarchy` per category recorded.
- [ ] Every color/spacing/font utility verified in `packages/tokens/dist/theme.css`.
- [ ] Component: geometry on the size axis, colors in compoundVariants, all tokens bound (no hardcoded hex).
- [ ] Props are a hand-written discriminated union — invalid combos don't compile; no runtime fallbacks.
- [ ] `index.ts` updated; merged-away files/exports deleted.
- [ ] Registry item added/merged; `meta.ai` lines carry `[분류]` category prefixes; `build-registry.ts` re-run; stale JSON removed.
- [ ] Docs page in the section order (Examples optional); shadcn typography scale (h1 `text-3xl`, H3 `text-xl`); hero playground; `demo()` cast only in `.map()`s.
- [ ] Playground controls mirror Figma props in Figma order; dependent dropdowns hide impossible combos; Code tab uses a `code` override reflecting real source structure.
- [ ] API Reference lists all props with Figma/Code/Both Origin badges + legend.
- [ ] AI 가이드 rendered as a `분류 | 가이드` table (mirrors `meta.ai` categories).
- [ ] For a doc-only merge: no no-op prop added; docstring + registry + docs cover the new set.
- [ ] `NAV` updated; removed pages/dirs deleted.
- [ ] `packages/ui` + `apps/docs` typecheck clean; negative type test passes; temp file removed.
