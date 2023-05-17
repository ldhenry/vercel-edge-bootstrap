import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { createClient, parseConnectionString } from "@vercel/edge-config";
import {
  LDContext,
  LDMultiKindContext,
  init,
} from "@launchdarkly/vercel-server-sdk";
import launchdarklySingleton from "lib/launchdarkly";
export const config = {
  matcher: "/",
};

const edgeClient = createClient(process.env.EDGE_CONFIG);
if (!edgeClient) {
  throw new Error("Edge Client could not be initialized");
}

const ldClient = init(process.env.LD_CLIENT_SIDE_ID || "", edgeClient, {
  sendEvents: true,
});

const flush = async () => {
  await ldClient.flush();
  console.log("done flushing");
};

export async function middleware(req: NextRequest, context: NextFetchEvent) {
  // for demo purposes, warn when there is no EDGE_CONFIG
  if (
    !process.env.EDGE_CONFIG ||
    !parseConnectionString(process.env.EDGE_CONFIG)
  ) {
    req.nextUrl.pathname = "/missing-edge-config";
    return NextResponse.rewrite(req.nextUrl);
  }

  try {
    const client = await launchdarklySingleton.getClient();
    console.log(req.headers.get("user-agent"));
    const flagContext: LDMultiKindContext = {
      kind: "multi",
      url: {
        key: req.url,
      },
      method: {
        key: req.method,
      },
      "user-agent": {
        key: req.headers.get("user-agent") || "unknown",
      },
    };
    const flags = (await client.allFlagsState(flagContext)).toJSON();

    const storeClosed = await client.variation(
      "store-closed",
      flagContext,
      false
    );

    if (storeClosed) {
      req.nextUrl.pathname = `/_closed`;
      return NextResponse.rewrite(req.nextUrl);
    }
    context.waitUntil(flush());
    console.log("returning");
  } catch (error) {
    console.error(error);
  }
}
