/**
 * Builds the llms.txt docs channel from the registry (single source of truth):
 *   apps/docs/public/llms.txt                       — index (component list + links)
 *   apps/docs/public/llms-full.txt                  — every component doc concatenated
 *   apps/docs/public/components/<name>/llms.txt      — one component (what "Copy Page" copies)
 *
 * Source of truth is `registry/registry.ts` (title/description/meta.ai), so the
 * docs page, the machine `meta.ai`, and the Copy Page button never drift.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { registry, type RegistryItem } from "../../../registry/registry.ts";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, "..", "public");

/** kebab-case registry name → PascalCase @uds/ui export (button-group → ButtonGroup). */
function exportName(name: string): string {
  return name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

/** One component's markdown doc — title, summary, install, import, and the meta.ai guide. */
function componentDoc(item: RegistryItem): string {
  const out = [
    `# ${item.title} (UDS)`,
    "",
    `> ${item.description}`,
    "",
    "## Install",
    "```bash",
    `npx @uds/cli add ${item.name}`,
    "```",
    "",
    "## Usage",
    "```tsx",
    `import { ${exportName(item.name)} } from "@uds/ui"`,
    "```",
  ];
  const ai = item.meta?.ai ?? [];
  if (ai.length) {
    out.push("", "## Guide");
    for (const rule of ai) out.push(`- ${rule}`);
  }
  out.push("");
  return out.join("\n");
}

mkdirSync(publicDir, { recursive: true });

// Per-component files (what Copy Page fetches).
for (const item of registry) {
  const dir = join(publicDir, "components", item.name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "llms.txt"), componentDoc(item));
  console.log(`✓ components/${item.name}/llms.txt`);
}

// Full concatenation.
const full = [
  "# UDS — Unified Design System (full docs)",
  "",
  "> Figma 디자인 자산을 토큰·프롭 기반 React 컴포넌트로 자산화한 레지스트리.",
  "",
  registry.map(componentDoc).join("\n---\n\n"),
].join("\n");
writeFileSync(join(publicDir, "llms-full.txt"), full);
console.log("✓ llms-full.txt");

// Index.
const shorten = (d: string) => (d.length > 90 ? `${d.slice(0, 90).trim()}…` : d);
const index = [
  "# UDS — Unified Design System",
  "",
  "> Figma 디자인 자산을 코드로 자산화한 컴포넌트 레지스트리. 벤더 중립 레지스트리와 MCP로 AI 툴·코드베이스에 배포됩니다.",
  "",
  "## Components",
  ...registry.map((i) => `- [${i.title}](/components/${i.name}/llms.txt): ${shorten(i.description)}`),
  "",
  "전체 문서: /llms-full.txt",
  "",
].join("\n");
writeFileSync(join(publicDir, "llms.txt"), index);
console.log(`✓ llms.txt (${registry.length} components)`);

// ── AI usage rules (for a consumer repo's CLAUDE.md / .cursorrules) ──────────
const RULES = `# UDS — AI 사용 규칙

당신은 UDS(Unified Design System)를 쓰는 앱의 화면을 만든다. 아래를 반드시 지킨다.

- 화면은 @uds/ui 컴포넌트로 조립한다. 버튼·입력·체크박스·칩 등을 <div>+Tailwind로 직접 만들지 않는다.
- 사용 가능한 컴포넌트: ${registry.map((i) => exportName(i.name)).join(", ")}.
- 각 컴포넌트는 카탈로그에 정의된 프롭·조합만 쓴다. 정의되지 않은 조합은 타입 에러다.
- 색·간격·폰트는 디자인 토큰 유틸만 쓰고 하드코딩(#hex, px)하지 않는다. 소비 앱엔 @uds/tokens/theme.css가 import돼 있어야 한다.
- 상호작용 상태(hover/pressed/focus/checked/disabled)는 프롭이 아니라 CSS·네이티브 속성으로 표현된다.
- import 경로: import { Button } from "@/components/ui/button" (또는 @uds/ui).
- 설치: npx @uds/cli add <name>  (또는 npx shadcn@latest add <registry>/r/<name>.json)
`;

// ── Screen composition recipes (grounded in the example screens) ─────────────
const RECIPES = `# 화면 조립 레시피

화면 요청이 오면 가장 가까운 레시피를 골라 시작한다. 하단 고정 버튼은 Cta로 감싼다.

## 로그인 / 회원가입
Header(뒤로가기+제목) + TextField(email) + TextField(password) + Checkbox(약관 동의) + Cta > ButtonGroup > Button(primary "로그인").

## 배송지 / 주소 입력
Header + TextField(받는사람·연락처) + [TextField(우편번호) + Button(module outline "주소검색")] + TextField(기본/상세주소) + Checkbox(기본 배송지로 설정) + Cta > Button("저장").

## 요금제 / 결제수단 선택
Header + Radio 그룹(같은 name 공유, 첫 항목 defaultChecked) + Cta > Button("다음").

## 목록 필터 / 탐색
Header + ChipGroup(자식 Chip variant="filter", 첫 칩 selected). 정렬 진입점은 Chip variant="trigger". 칩이 많으면 wrap={false}(가로 스크롤), 다 보여줄 땐 wrap.

## 약관 동의
Header + Checkbox(전체 동의) + Checkbox 목록(개별 N개) + Cta > Button("동의하고 계속").
`;

// The one-paste kit designers drop into any AI chat: rules → recipes → full catalog.
const aiKit = [
  RULES,
  RECIPES,
  "# 컴포넌트 카탈로그",
  "",
  registry.map(componentDoc).join("\n---\n\n"),
].join("\n");
writeFileSync(join(publicDir, "ai-kit.txt"), aiKit);
console.log("✓ ai-kit.txt");

// Rules-only file to save as CLAUDE.md / .cursorrules in a consuming repo.
writeFileSync(join(publicDir, "uds-rules.md"), RULES);
console.log("✓ uds-rules.md");

// ── Example screens (real composition source) — grounds MCP / AI on how full
//    screens are actually assembled, not just individual components. ──────────
const EXAMPLE_TITLES: Record<string, string> = {
  address: "배송지 입력",
  roaming: "해외로밍 사용요금조회",
};
const examplesSrc = join(here, "..", "app", "examples");
const examplesOut = join(publicDir, "examples");
mkdirSync(examplesOut, { recursive: true });

const exItems: { name: string; title: string; description: string }[] = [];
for (const entry of readdirSync(examplesSrc, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const name = entry.name;
  const screen = join(examplesSrc, name, `${name}-screen.tsx`);
  if (!existsSync(screen)) continue;
  const title = EXAMPLE_TITLES[name] ?? name;
  const description = `UDS 컴포넌트로 조립한 ${title} 화면. 실제 조립·레이아웃을 그대로 따라 쓸 참조.`;
  writeFileSync(
    join(examplesOut, `${name}.json`),
    JSON.stringify({ name, title, description, source: readFileSync(screen, "utf8") }, null, 2)
  );
  exItems.push({ name, title, description });
  console.log(`✓ examples/${name}.json`);
}
writeFileSync(join(examplesOut, "index.json"), JSON.stringify({ items: exItems }, null, 2));
writeFileSync(join(examplesOut, "guide.json"), JSON.stringify({ rules: RULES, recipes: RECIPES }, null, 2));
console.log(`✓ examples/index.json + guide.json (${exItems.length} screens)`);
