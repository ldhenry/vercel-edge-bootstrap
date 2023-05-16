import { NextRequest, NextResponse } from "next/server";
import { createClient, parseConnectionString } from "@vercel/edge-config";
import { LDContext, init } from "@launchdarkly/vercel-server-sdk";

export const config = {
  matcher: "/",
};

const edgeClient = createClient(process.env.EDGE_CONFIG);
if (!edgeClient) {
  throw new Error("Edge Client could not be initialized");
}
const ldClient = init(process.env.LD_CLIENT_SIDE_ID || "", edgeClient);

export async function middleware(req: NextRequest) {
  // for demo purposes, warn when there is no EDGE_CONFIG
  if (
    !process.env.EDGE_CONFIG ||
    !parseConnectionString(process.env.EDGE_CONFIG)
  ) {
    req.nextUrl.pathname = "/missing-edge-config";
    return NextResponse.rewrite(req.nextUrl);
  }

  try {
    await ldClient.waitForInitialization();
    const flagContext: LDContext = {
      kind: "user",
      key: "test-user",
    };
    const flags = (await ldClient.allFlagsState(flagContext)).toJSON();

    const storeClosed = await ldClient.variation(
      "store-closed",
      flagContext,
      false
    );

    if (storeClosed) {
      req.nextUrl.pathname = `/_closed`;
      return NextResponse.rewrite(req.nextUrl);
    }
  } catch (error) {
    console.error(error);
  }
}
