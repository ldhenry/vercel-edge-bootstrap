import "tailwindcss/tailwind.css";
import Nav from "components/nav";
import launchdarklySingleton from "lib/launchdarkly";
import { ReactElement } from "react";
import { headers } from "next/headers";
import { LDMultiKindContext } from "@launchdarkly/vercel-server-sdk";

export const runtime = "edge";

export default async function RootLayout(props: {
  children: ReactElement;
  params: any;
}) {
  const headersList = headers();
  const ldClient = await launchdarklySingleton.getClient();
  const context: LDMultiKindContext = {
    kind: "multi",
    user: { key: "anonymous", anonymous: true },
    "user-agent": { key: headersList.get("user-agent") || "unknown" },
    method: {
      key: "GET",
    },
  };

  const bootstrappedFlags = (
    await ldClient.allFlagsState(context)
  ).toJSON() as {
    "bootstrap-flags": boolean;
  };
  if (bootstrappedFlags["bootstrap-flags"]) {
    props.params.bootstrappedFlags = bootstrappedFlags;
  }

  props.params.envId = process.env.LD_CLIENT_SIDE_ID;
  props.params.context = context;
  return (
    <html lang="en">
      <body>
        <Nav />
        {props.children}
      </body>
    </html>
  );
}
