import { registerTools } from "./tools/task.tool.js";
import { registerResources } from "./tools/task.resouce.js";
import { registerPrompts } from "./tools/task.prompt.js";
import { connectDB, disconnectDB } from "./config/connectDB.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "task-manager",
  version: "1.0.0",
});

await connectDB();

// This is where we register all our tools (the functions that can be called by the AI agent). We define these tools in task.tool.ts and they internally call the service functions in task.service.ts to interact with the database. By registering them here, we make them available for the AI agent to use when processing user requests.
registerTools(server);
// Resources → The data or tools the AI can access (files, databases, APIs, etc.).
// Prompts → The instructions that tell the AI what to do with those resources.
registerResources(server);
registerPrompts(server);

// Handle clean shutdown
//  When Claude Desktop closes or the process is killed, disconnect from MongoDB gracefully before exiting.

process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectDB();
  process.exit(0);
});


const transport = new StdioServerTransport();
await server.connect(transport);