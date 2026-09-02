#!/usr/bin/env node
/**
 * UDS MCP server — exposes the design system to AI tools (Claude Code, Cursor, …).
 *
 * Tools:
 *   - list_components    → available components (name, title, description)
 *   - get_component      → full source + dependencies + AI usage guide for one component
 *   - get_design_tokens  → the design token set (color / radius / spacing / typography)
 *
 * Reads the same registry JSON the CLI and docs site use ($UDS_REGISTRY or in-repo).
 * Vendor-neutral — no shadcn dependency.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { color, radius, spacing, fontSize, font } from "@uds/tokens";
import { loadJson, type RegistryItem } from "./registry.ts";

const json = (data: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] });

const server = new McpServer({ name: "uds", version: "0.0.0" });

server.tool(
  "list_components",
  "List all UDS design-system components available for use.",
  {},
  async () => {
    const index = await loadJson<{ items: RegistryItem[] }>("index");
    return json(
      index.items.map((i) => ({ name: i.name, title: i.title, description: i.description }))
    );
  }
);

server.tool(
  "get_component",
  "Get one UDS component: source files, npm dependencies, and its AI usage guide. Use this before writing code that uses a UDS component.",
  { name: z.string().describe("Component name, e.g. \"button\"") },
  async ({ name }) => {
    const item = await loadJson<RegistryItem>(name);
    return json({
      name: item.name,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies,
      aiGuide: item.meta?.ai ?? [],
      files: item.files.map((f) => ({ target: f.target, content: f.content })),
    });
  }
);

server.tool(
  "get_design_tokens",
  "Get the UDS design tokens (Figma-1:1 names). Use these instead of hardcoded colors/spacing.",
  {},
  async () => json({ color, radius, spacing, fontSize, font })
);

await server.connect(new StdioServerTransport());
