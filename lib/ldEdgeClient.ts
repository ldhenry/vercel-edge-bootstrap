import { BasicLogger, LDOptions, init } from "@launchdarkly/vercel-server-sdk";
import { createClient } from "@vercel/edge-config";

const edgeClient = createClient(process.env.EDGE_CONFIG);
if (!edgeClient) {
  throw new Error("Edge Client could not be initialized");
}

const options: LDOptions = {
  sendEvents: true,
  logger: new BasicLogger({ level: "debug" }),
  serverSideKey: process.env.LD_SERVER_SIDE_KEY,
};

if (process.env.EVENTS_URI) {
  options.eventsUri = process.env.EVENTS_URI;
}

export const ldEdgeClient = init(
  process.env.LD_CLIENT_SIDE_ID || "",
  edgeClient,
  options
);
