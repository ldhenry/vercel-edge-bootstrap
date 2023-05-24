"use client";

import { LDContext, LDFlagSet } from "launchdarkly-js-client-sdk";
import { withLDProvider } from "launchdarkly-react-client-sdk";
import { ReactNode } from "react";

type LaunchDarklyProviderProps = {
  envId: string;
  context: LDContext;
  bootstrappedFlags?: LDFlagSet;
  children: ReactNode;
};

export default function LaunchDarklyProvider({
  envId,
  context,
  bootstrappedFlags,
  children,
}: LaunchDarklyProviderProps) {
  const LDProvider = withLDProvider({
    clientSideID: envId,
    context: context,
    reactOptions: {
      useCamelCaseFlagKeys: false,
    },
    options: {
      bootstrap: bootstrappedFlags,
      streaming: false,
    },
  })(() => {
    return <>{children}</>;
  });

  return <LDProvider />;
}
