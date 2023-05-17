import { LDClient, init } from "@launchdarkly/vercel-server-sdk";
import { createClient } from "@vercel/edge-config";

class LaunchDarklyClient {
  ldClient: LDClient;

  constructor() {
    const edgeClient = createClient(process.env.EDGE_CONFIG);
    if (!edgeClient) {
      throw new Error("Edge Client could not be initialized");
    }
    this.ldClient = init(process.env.LD_CLIENT_SIDE_ID || "", edgeClient);
  }

  async getClient() {
    await this.ldClient.waitForInitialization();
    return this.ldClient;
  }
}

const launchdarklySingleton = new LaunchDarklyClient();
Object.freeze(launchdarklySingleton);

export default launchdarklySingleton;
