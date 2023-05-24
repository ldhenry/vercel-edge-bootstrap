import "tailwindcss/tailwind.css";
import Nav from "components/nav";
import { ReactElement } from "react";
import { headers } from "next/headers";
import { LDMultiKindContext } from "@launchdarkly/vercel-server-sdk";
import LaunchDarklyProvider from "components/launchdarklyProvider";
import { ldEdgeClient } from "lib/ldEdgeClient";

export const runtime = "edge";

export default async function RootLayout(props: {
  children: ReactElement;
  params: any;
}) {
  const headersList = headers();
  await ldEdgeClient.waitForInitialization();

  const context: LDMultiKindContext = {
    kind: "multi",
    user: { key: "anonymous", anonymous: true },
    "user-agent": { key: headersList.get("user-agent") || "unknown" },
    method: {
      key: "GET",
    },
  };

  const allFlags = (await ldEdgeClient.allFlagsState(context)).toJSON() as {
    "bootstrap-flags": boolean;
  };
  const bootstrappedFlags = allFlags["bootstrap-flags"] ? allFlags : undefined;

  return (
    <html lang="en">
      <body>
        <LaunchDarklyProvider
          envId={process.env.LD_CLIENT_SIDE_ID || ""}
          context={context}
          bootstrappedFlags={bootstrappedFlags}
        >
          <Nav />
          {props.children}
        </LaunchDarklyProvider>
      </body>
    </html>
  );
}
