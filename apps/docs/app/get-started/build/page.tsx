import Link from "next/link";
import { CodeBlock } from "../../../components/code-block.tsx";
import { H2, H3 } from "../../../components/doc.tsx";

export const metadata = { title: "화면 만들기 — UDS" };

export default function BuildPage() {
  return (
    <article className="max-w-3xl">
      <header>
        <p className="pl-0.5 text-xs font-medium text-text-base-tertiary">Get Started</p>
        <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight">화면 만들기</h1>
        <p className="mt-3 text-sm text-text-base-tertiary">
          <Link className="underline underline-offset-4" href="/get-started/installation">
            설치
          </Link>
          를 마쳤으면, 이제 AI에게 명령해 UDS 컴포넌트로 화면을 뽑습니다. 핵심은 AI가 UDS의{" "}
          <strong>실제 코드를 읽고</strong> 조립하게 하는 것입니다.
        </p>
      </header>

      <H2>1. AI에게 화면을 요청</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        MCP를 등록했다면, AI가 규칙·예시·컴포넌트 소스를 도구로 직접 가져옵니다. 그대로 요청하세요.
      </p>
      <div className="mt-3">
        <CodeBlock
          lang="text"
          code={
            "UDS로 로그인 화면 만들어줘.\n- uds MCP의 get_screen_guide로 규칙·레시피를 읽고\n- get_example로 비슷한 예시 화면 소스를 참고해서\n- @uds/ui 컴포넌트로만 조립해. 직접 만들지 마."
          }
        />
      </div>
      <H3>MCP 없이 (레포를 Claude Code로 연 경우)</H3>
      <div className="mt-3">
        <CodeBlock
          lang="text"
          code={
            "이 레포의 packages/ui/src 컴포넌트로 로그인 화면을 만들어줘.\napps/docs/app/examples/address 예시의 조립 방식을 그대로 따라 하고,\n@uds/ui 컴포넌트만 쓰고 새로 만들지 마."
          }
        />
      </div>

      <H2>2. 만든 화면 실행 (스타일까지)</H2>
      <p className="mt-1 text-sm text-text-base-tertiary">
        컴포넌트가 디자인 토큰을 쓰므로, 앱에 토큰 테마가 있어야 색이 나옵니다(
        <Link className="underline underline-offset-4" href="/get-started/installation">
          설치
        </Link>
        의 전역 셋업). 컴포넌트가 부족하면 AI에게 CLI 설치까지 시키세요.
      </p>
      <div className="mt-3">
        <CodeBlock lang="bash" code={"npx @uds/cli add button   # 필요한 컴포넌트만 소스로 복사"} />
      </div>

      <H2>3. 잘 나오게 하는 팁</H2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-text-base-tertiary">
        <li>“<strong>@uds/ui 컴포넌트만 쓰고 새로 만들지 마</strong>”를 항상 명시하면 자의적 생성이 줄어듭니다.</li>
        <li>비슷한 화면이 있으면 예시 이름(<code>address</code> · <code>roaming</code>)을 콕 집어 주세요.</li>
        <li>정의되지 않은 조합은 타입 에러로 막히니, AI가 틀리면 에러를 그대로 붙여 고치게 하면 됩니다.</li>
        <li>
          반복 작업이면 레포 루트에 규칙을 저장하세요:{" "}
          <a className="underline underline-offset-4" href="/uds-rules.md">
            /uds-rules.md
          </a>{" "}
          → <code>CLAUDE.md</code> 또는 <code>.cursorrules</code>.
        </li>
      </ul>
    </article>
  );
}
