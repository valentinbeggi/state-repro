import { McpServer } from "skybridge/server";
import { z } from "zod";

const server = new McpServer(
  { name: "state-repro", version: "0.0.1" },
  { capabilities: {} },
).registerWidget(
  "state-test",
  { description: "State persistence test widget" },
  {
    description: "Test useState vs useWidgetState across fullscreen remount",
    inputSchema: {
      name: z.string().optional().default("World"),
    },
  },
  async ({ name }) => ({
    structuredContent: { message: `Hello ${name}!`, timestamp: Date.now() },
    content: [{ type: "text", text: `Greeting ${name}` }],
    isError: false,
  }),
);

export default server;
export type AppType = typeof server;
