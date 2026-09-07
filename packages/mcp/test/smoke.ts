/** Spawns the UDS MCP server over stdio and exercises its tools. */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pkgDir = join(dirname(fileURLToPath(import.meta.url)), "..");

const transport = new StdioClientTransport({
  command: "node",
  args: [join(pkgDir, "src", "server.ts")],
});
const client = new Client({ name: "uds-smoke", version: "0.0.0" });
await client.connect(transport);

/** First text block of a tool result. */
function firstText(result: unknown): string {
  const content = (result as { content?: { text?: string }[] }).content;
  const block = content?.[0];
  if (!block?.text) throw new Error("tool returned no text content");
  return block.text;
}

const { tools } = await client.listTools();
const names = tools.map((t) => t.name).sort();
console.log("tools:", names.join(", "));
const expected = [
  "get_component",
  "get_design_tokens",
  "get_example",
  "get_screen_guide",
  "list_components",
  "list_examples",
];
for (const e of expected) if (!names.includes(e)) throw new Error(`missing tool: ${e}`);

const listed = await client.callTool({ name: "list_components", arguments: {} });
const listText = firstText(listed);
if (!listText.includes("button")) throw new Error("list_components did not return button");
console.log("list_components:", JSON.parse(listText).map((c: { name: string }) => c.name).join(", "));

const comp = await client.callTool({ name: "get_component", arguments: { name: "button" } });
const compData = JSON.parse(firstText(comp));
if (!compData.files?.some((f: { target: string }) => f.target.endsWith("button.tsx")))
  throw new Error("get_component missing button.tsx");
if (!compData.aiGuide?.length) throw new Error("get_component missing aiGuide");
console.log(`get_component(button): ${compData.files.length} files, ${compData.aiGuide.length} AI guide rules`);

const tokens = await client.callTool({ name: "get_design_tokens", arguments: {} });
const tokData = JSON.parse(firstText(tokens));
if (tokData.color["container-brand-primary-high"] !== "#e10975")
  throw new Error("get_design_tokens wrong brand color");
console.log("get_design_tokens: brand primaryHigh =", tokData.color["container-brand-primary-high"]);

const guide = await client.callTool({ name: "get_screen_guide", arguments: {} });
const guideData = JSON.parse(firstText(guide));
if (!guideData.rules || !guideData.recipes) throw new Error("get_screen_guide missing rules/recipes");
console.log("get_screen_guide: rules + recipes present");

const examples = await client.callTool({ name: "list_examples", arguments: {} });
const exList = JSON.parse(firstText(examples));
if (!exList.length) throw new Error("list_examples returned none");
console.log("list_examples:", exList.map((e: { name: string }) => e.name).join(", "));

const ex = await client.callTool({ name: "get_example", arguments: { name: exList[0].name } });
const exData = JSON.parse(firstText(ex));
if (!exData.source?.includes("@uds/ui")) throw new Error("get_example missing real source");
console.log(`get_example(${exData.name}): ${exData.source.length} chars of real source`);

await client.close();
console.log("\n✓ MCP smoke test passed");
