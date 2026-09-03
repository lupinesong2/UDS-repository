---
name: uds-code-connect
description: UDS 코드 컴포넌트를 Figma 컴포넌트 세트에 Figma Code Connect로 연결하고 CLI(v2 템플릿)로 퍼블리시하며 문서 상태 페이지를 동기화한다. "code connect", "코드 커넥트", "피그마랑 연결", "connect this component to Figma", "publish code connect", "Dev Mode에 코드 보이게", 또는 만든 컴포넌트를 Figma node에 매핑/연결하라고 할 때 트리거.
---

# UDS Code Connect (code ↔ Figma)

Code Connect는 Figma **Dev Mode**에 디자인 컴포넌트의 실제 코드 스니펫 + GitHub 소스를 보여준다. **매핑/참조**일 뿐 sync 엔진이 아니다 — 디자인이 바뀌어도 코드를 바꾸지 않고, 컴포넌트를 생성하지도 않는다. 매핑은 Figma 컴포넌트 **세트**마다 작은 파일 하나.

지속적·CI 친화적 방식은 레포에서 퍼블리시하는 **`@figma/code-connect` v2 CLI + 템플릿 파일(`*.figma.ts`)**(레포가 source of truth). 빠른 **MCP** 경로(토큰 불필요)도 있지만 매핑이 Figma에만 남으므로, 지속적인 건 CLI를 선호한다.

---

## 0. 사전 준비 (대부분 1회, 사용자 측)

- **Figma 플랜**: Code Connect는 **Organization/Enterprise** 필요. (MCP `send_code_connect_mappings`가 성공한 적 있으면 플랜은 이미 OK.)
- **Figma for GitHub 앱**: 설치 + **레포 접근 권한 부여**. **개인** GitHub 계정 OK(GitHub org 불필요), **비공개** 레포 OK·무료 — 그 레포에 앱 접근만 부여. (Figma 프롬프트의 "Organization"은 *Figma* 플랜을 말하는 것이지 GitHub org가 아님.)
- **레포를 GitHub에 push** 해야 `source=` 링크가 해석됨.
- Node ≥ 25: corepack `pnpm`이 크래시할 수 있음(`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`) — `~/.local/bin/pnpm` 또는 `node_modules/.bin/figma` 직접 사용.

## 1. 토큰 취급 (보안 중요)

CLI는 **Figma personal access token**으로 인증. 스코프: **`file_code_connect` = Write**, **`file_content` = Read**(나머지 No access). 최소 권한 — MCP/캔버스 워크플로는 이 토큰을 쓰지 않으니 "나중을 위해" 스코프를 추가하지 말 것.

**`.env`**(이미 gitignore)에 `FIGMA_ACCESS_TOKEN=...`으로 저장. 그다음:

- **절대 `source .env` 금지** — 잘못된 줄이 있으면 셸이 토큰을 실행해 transcript/로그에 남는다(실제로 한 번 발생 → 토큰 revoke함). 값만 추출하고 따옴표/CR 제거:

```bash
export FIGMA_ACCESS_TOKEN="$(sed -n 's/^FIGMA_ACCESS_TOKEN=[[:space:]]*//p' .env | tr -d '\r' | sed -e 's/^["'\'']//' -e 's/["'\'']$//')"
```

- 토큰을 echo할 수 있는 출력은 **항상 리댁션**: `... 2>&1 | sed -E 's/figd_[A-Za-z0-9_-]+/figd_***REDACTED***/g'`
- 토큰이 출력되면 즉시 사용자에게 **revoke + reissue** 안내.
- 토큰을 출력하지 않고 진단: `printf 'len=%s prefix=%s\n' "${#T}" "${T:0:5}"` (유효 토큰은 `figd_` + ~40자. 앞의 `"`/끝의 char-code 34 = 따옴표째 저장됨 → 403 Invalid token).

## 2. node id + 정확한 속성명 확인

`list_file_components_for_code_connect(fileKey)`(MCP) — 퍼블리시된 모든 세트를 node id와 **정확한 속성명**과 함께 반환. 속성명엔 **글자 그대로 맞춰야 하는** glyph 접두사가 포함됨:

- `◐ hasIcon-start`, `◑ hasIcon-end`, `↔ icon-start`, `↔ icon-end`, `◒ hasSystemUi-bottom`, `<-> systemUi`
- 평문: `text`, `variant`, `hierarchy`, `isDisabled`, `isTyping`, `isError`, `hasLabel`, `hasSupporting`, `direction`, `contentType`, `onFrameHigh`

(출력이 매우 클 수 있음 — 전부 로드하지 말고 저장된 tool-result 파일을 세트 이름으로 grep. Agent 툴이 있으면 서브에이전트로 처리.)

**디자인 전용 축은 매핑하지 않는다:** 코드에서 CSS/네이티브로 표현되는 축(예: `isTyping` = `:focus-within`)은 프롭이 아니므로 템플릿에서 생략한다.

## 3. 세트 node마다 `*.figma.ts` 템플릿 하나 작성

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

- **세트 node마다 파일 하나**(예: Button → `button-page/module/inline.figma.ts`).
- 파일 상단에 헤더 주석 3줄: `// url=...node-id=<id>`, `// source=<GitHub blob URL>`, `// component=<Name>`.
- **조합 컴포넌트**(ButtonGroup, Cta): `{figma.children("*")}` 렌더 + `metadata: { nestable: true }`로 중첩 인스턴스가 *자기* 매핑으로 해석되게.
- example에 category/context를 하드코딩(세트마다 고정).
- 파일 이름은 서술적으로(migrate 기본값 `_1`/`_2` 말고).
- 값(라벨/placeholder 등)이 세트 프롭이 아니라 중첩 자식에 있으면 `getString("text")`가 세트 레벨에서 없을 수 있음 — 대표 값을 `renderProp`으로 넣거나 `hasLabel`/`hasSupporting` boolean으로 존재만 토글.

## 4. 설정 + 스크립트 (1회)

```jsonc
// figma.config.json (repo root) — v2 templates, no `parser` field
{ "codeConnect": { "include": ["packages/ui/src/components/**/*.figma.ts"] } }
```

- `packages/ui/tsconfig.json` → `"exclude": ["**/*.figma.ts", "**/*.figma.tsx"]` (템플릿 런타임 `figma`를 import하지 앱 코드가 아님 — tsc에 걸리면 안 됨).
- root `package.json` devDep `@figma/code-connect`(v2) + 스크립트: `"figma:check": "figma connect publish --dry-run"`, `"figma:publish": "figma connect publish"`.

## 5. 검증 → 퍼블리시

```bash
export FIGMA_ACCESS_TOKEN="$(sed -n 's/^FIGMA_ACCESS_TOKEN=[[:space:]]*//p' .env | tr -d '\r' | sed -e 's/^["'\'']//' -e 's/["'\'']$//')"
node_modules/.bin/figma connect publish --dry-run 2>&1 | sed -E 's/figd_[A-Za-z0-9_-]+/figd_***REDACTED***/g'   # → "All Code Connect files are valid"
node_modules/.bin/figma connect publish --force  2>&1 | sed -E 's/figd_[A-Za-z0-9_-]+/figd_***REDACTED***/g'   # --force = 기존 매핑 덮어쓰기
```

(pnpm이 동작하면 `pnpm figma:check` / `pnpm figma:publish -- --force`도 동일.) 퍼블리시하면 레포 `*.figma.ts`가 단일 source of truth가 됨. 같은 node에 이전 매핑(MCP "UI-created")이 있으면 `--force` 필요.

## 6. parser(v1) → 템플릿(v2) 마이그레이션

`.figma.tsx` parser 파일(v1)이 있으면 CLI v2가 거부함("framework parsers no longer supported"). 마이그레이션:

```bash
node_modules/.bin/figma connect migrate      # .figma.tsx → .figma.ts templates (needs token)
```

그다음: 자동 생성된 `foo_1.figma.ts`/`foo_2.figma.ts`를 서술적으로 rename, 옛 `.figma.tsx` **삭제**, `figma.config.json`에서 `"parser"` + 컴포넌트 소스 glob 제거(템플릿은 self-contained).

## 7. 문서 상태 페이지 (별도)

`/code-connect` 문서 페이지는 퍼블리시와 독립적으로 스냅샷에서 생성:
- `apps/docs/scripts/code-connect-map.json` — MCP `get_code_connect_map`으로 fetch(세트 node를 키로, `{componentName, source}` 쌍으로 정규화. source는 짧은 경로 `packages/ui/src/components/<name>.tsx`).
- `apps/docs/scripts/build-code-connect.ts` — `MANIFEST`와 교차 참조 → `apps/docs/app/code-connect/mappings.generated.ts`.

**새 매핑 추가 시:** ① `MANIFEST`에 `{ component, source, figmaSet, nodeId }` 한 줄, ② `code-connect-map.json`에 세트 node 키로 `[{componentName, source}]`, ③ `node apps/docs/scripts/build-code-connect.ts` 재실행(→ `N/N connected`).

매핑이 레포에 `*.figma.ts`로 있으면 이 fetch 단계를 파일 직접 스캔으로 대체 가능(각 파일의 `// url=...node-id=` + `// component=` 헤더 = 연결된 매핑 하나) → MCP/토큰 없이 완전 CI 자동화. 자동화 단계로 제안할 것.

---

## 트러블슈팅 (실제로 겪은 것들)

| 증상 | 원인 → 해결 |
|---|---|
| `403 Invalid token` | `.env`에서 토큰이 따옴표째(추출이 따옴표 남김)이거나 revoke됨/스코프 오류. 따옴표 제거(§1); `file_code_connect`=Write 확인. |
| 출력에 토큰 노출 | `source .env`가 잘못된 줄 실행. 값 추출(§1) + `figd_` 리댁션. **revoke + reissue.** |
| `framework parsers no longer supported` | CLI v2 + `.figma.tsx` parser 파일. 템플릿으로 마이그레이션(§6). |
| `second argument to figma.connect() must be a string literal` | v1 parser는 리터럴 URL 필요(`${...}`/루프 불가). (v2 템플릿은 `figma.connect` 안 씀.) |
| `Import for X could not be resolved` | v1: 컴포넌트 소스를 `include`에 추가하거나 상대 import; v2 템플릿은 self-contained `imports`로 회피. |
| 퍼블리시 시 `Using "html" parser` 경고 | 템플릿 파일엔 무해 — 그래도 검증됨. |
| pnpm이 Node ≥ 25에서 크래시 | `~/.local/bin/pnpm` 또는 `node_modules/.bin/figma`. |

## 체크리스트

- [ ] 사전 준비: Org/Enterprise Figma, Figma-for-GitHub 앱 레포 권한, 레포 push.
- [ ] 토큰이 `.env`(gitignore), 스코프 `file_code_connect`(W)+`file_content`(R); 절대 source/echo 안 함; 출력 리댁션.
- [ ] 세트 node마다 서술적 이름의 `*.figma.ts` 템플릿 + 헤더 3줄; 정확한 glyph 속성명; 디자인 전용 축 미매핑; 조합은 `figma.children("*")` + `nestable`.
- [ ] `figma.config.json` 템플릿 전용 include; `*.figma.ts(x)` tsc 제외.
- [ ] `figma:check` valid → `figma:publish -- --force`.
- [ ] 문서 상태 페이지 동기화(MANIFEST + map JSON + 재생성 → `N/N connected`).
- [ ] `.env` 미커밋; CLI 출력에 raw 토큰 없음.
