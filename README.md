# UDS — Unified Design System

Figma 디자인 자산을 **코드 자산 + 배포 가능한 컴포넌트 레지스트리**로 만드는 모노레포입니다.
목표는 회사 여러 서비스의 품질을 디자인시스템 중심으로 상향시키는 것입니다.

## 빠른 사용 — Claude로 화면 만들기 (튜토리얼)

UDS 컴포넌트로 화면을 AI에게 만들게 하는 가장 짧은 길. 핵심은 Claude가 이 레포의 **실제 코드**(컴포넌트·예시)를 읽게 하는 것 — 그래야 자의적으로 그리지 않습니다.

```bash
git clone https://github.com/lupinesong2/UDS-repository
cd UDS-repository && pnpm install
```

**방법 A — Claude Code로 열고 요청 (MCP 불필요, 가장 간단)**

> 이 레포의 `packages/ui/src` 컴포넌트로 로그인 화면을 만들어줘.
> `apps/docs/app/examples/address` 예시의 조립 방식을 그대로 따라 하고,
> `@uds/ui` 컴포넌트만 쓰고 새로 만들지 마.

**방법 B — MCP 등록 (정밀·반복용)**

```bash
claude mcp add uds -- node "$(pwd)/packages/mcp/src/server.ts"
```
> UDS로 로그인 화면 만들어줘. `get_screen_guide`로 규칙 읽고,
> `get_example`로 비슷한 예시를 참고해서 `@uds/ui`로만 조립해.

**실행(스타일까지)**: 붙여넣을 앱에 Tailwind v4 + `@import "@uds/tokens/theme.css"`가 있어야 색이 나옵니다. 컴포넌트 설치는 `npx @uds/cli add <name>`. 자세한 시나리오는 문서 사이트 **Get Started → 화면 만들기**(`/get-started/build`).

## 아키텍처

```
uds/
├── packages/
│   ├── tokens/     @uds/tokens  — 디자인 토큰 단일 소스 (Figma 변수와 동기화)
│   │                             → dist/theme.css (CSS 변수 + Tailwind v4 @theme)
│   ├── ui/         @uds/ui      — React 컴포넌트 (Tailwind + CVA variants)
│   ├── icons/      @uds/icons   — currentColor 기반 24×24 SVG 아이콘 라이브러리
│   ├── cli/        @uds/cli     — 자체 설치 CLI (`uds add <component>`)
│   └── mcp/        @uds/mcp     — MCP 서버 (AI 툴에 컴포넌트·토큰 노출)
├── registry/       레지스트리 매니페스트 (배포 대상 정의)
└── apps/
    └── docs/       @uds/docs    — Next.js 문서 사이트
                                   · Foundations(디자인 토큰) / 컴포넌트 문서
                                   · 프리뷰 / 프롭스 플레이그라운드 / 코드 / AI 가이드
                                   · /r/*.json  벤더 중립 레지스트리 서빙
```

**데이터 흐름**: Figma 토큰 → `@uds/tokens` → Tailwind 유틸 → `@uds/ui` 컴포넌트
→ 문서 사이트 & 레지스트리 JSON → shadcn CLI / MCP로 다른 서비스에 배포.

## 기술 스택

- **모노레포**: pnpm workspace + Turborepo
- **컴포넌트**: React + Tailwind CSS v4 + class-variance-authority
- **문서**: Next.js 16 (App Router)
- **배포**: shadcn 호환 레지스트리 (`npx shadcn add <url>/r/<name>.json`)

## 실행

```bash
pnpm install
pnpm tokens            # 토큰 → CSS 생성
pnpm registry:build    # 레지스트리 JSON 생성 → apps/docs/public/r
pnpm dev               # 문서 사이트 (http://localhost:3000)
pnpm build             # 전체 빌드 (타입체크 포함)
```

## 컴포넌트 배포 (벤더 중립 — shadcn CLI 미의존)

레지스트리는 순수 JSON(`apps/docs/public/r/*.json`)이며, 두 채널로 소비합니다.

**개발자 — 자체 CLI** (`@uds/cli`)
```bash
npx @uds/cli add button           # 소스를 프로젝트로 복사 (import는 @/ 로 정규화)
npx @uds/cli list                 # 사용 가능한 컴포넌트 목록
# 로컬 개발: node packages/cli/src/index.ts add button --registry apps/docs/public/r --cwd <target>
```

**AI 툴 — MCP 서버** (`@uds/mcp`) — Claude Code / Cursor 등에 등록
```json
{ "mcpServers": { "uds": { "command": "npx", "args": ["-y", "@uds/mcp"] } } }
```
MCP 도구: `list_components`, `get_component`(소스+의존성+AI가이드), `get_design_tokens`,
`get_screen_guide`(규칙·조립 레시피), `list_examples`/`get_example`(실제 예시 화면 소스 — AI가 흉내낼 참조).
`$UDS_REGISTRY`로 레지스트리 위치(URL/경로) 지정 가능. LLM용 텍스트도 빌드로 생성됨:
`/llms.txt` · `/llms-full.txt` · `/ai-kit.txt`(규칙+카탈로그+레시피) · `/uds-rules.md`.

## 로드맵

- **0단계 (완료)**: 토큰→컴포넌트→문서→레지스트리 루프 확립. 현재 Button · ButtonGroup · CTA · Checkbox · Radio · Chip · ChipGroup · TextField · Header + 아이콘 라이브러리 보유
- **1단계 (진행)**: Figma 토큰 동기화, `/uds-component`로 컴포넌트 확장, 레지스트리 배포 라이브 → *개발 효율/품질 확보*
- **2단계 (진행)**: Figma Code Connect로 디자인-코드 연결 (현재 18/18 매핑 라이브), 기획/디자이너 핸드오프 워크플로우
- **3단계**: 여러 서비스 롤아웃 + 거버넌스

## 새 컴포넌트 추가

Figma 컴포넌트 세트 URL 하나를 **`/uds-component` 스킬**에 주면 아래 단계를 재현 가능한 규칙대로 자동 수행합니다(수동 절차이기도 함). 연결·감사용 스킬도 함께 있습니다 — **`/uds-code-connect`**(Dev Mode 매핑 `*.figma.ts`), **`/uds-component-check`**(Figma가 표현 못 하는 관계·접근성 감사).

1. `packages/ui/src/components/<name>.tsx` 작성 (토큰 유틸만 사용, 하드코딩 색상 금지)
2. `packages/ui/src/index.ts`에 export 추가
3. `registry/registry.ts`에 아이템 등록 (deps, files, AI 가이드)
4. `apps/docs/app/components/<name>/`에 문서 페이지 + 플레이그라운드 추가
5. `apps/docs/app/layout.tsx` 네비게이션에 추가
6. `pnpm registry:build` → 배포물 갱신
