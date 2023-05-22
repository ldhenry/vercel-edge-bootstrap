import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parseConnectionString } from "@vercel/edge-config";
import { LDMultiKindContext } from "@launchdarkly/vercel-server-sdk";
import launchdarklySingleton from "lib/launchdarkly";

export const config = {
  matcher: ["/", "/favicon.ico"],
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

    if (req.nextUrl.pathname === "/favicon.ico") {
      const hotDogFaviconEnabled = await client.variation(
        "enable-hot-dog-favicon",
        flagContext,
        false
      );
      if (hotDogFaviconEnabled) {
        req.nextUrl.pathname = "/hot-dog.ico";
      }

      return NextResponse.rewrite(req.nextUrl);
    }

    const storeClosed = await client.variation(
      "store-closed",
      flagContext,
      false
    );

    if (storeClosed) {
      req.nextUrl.pathname = `/_closed`;
      return NextResponse.rewrite(req.nextUrl);
    }

    return;
  } catch (error) {
    console.error(error);
  }
}
