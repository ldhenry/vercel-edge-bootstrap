# LaunchDarkly Feature Flag Apple Store

This template uses Edge Config as fast storage to control whether the store is open or closed.

## Demo

https://hello-vercel-edge.vercel.app/

## How to Use

#### Set up environment variables

Copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

This example requires you to set up an Edge Config and store its connection string in the `EDGE_CONFIG` environment variable.

Additionally, you will need to have the LaunchDarkly Vercel integration configured to push feature flag data to your Vercel Edge Config. Read [Vercel](https://docs.launchdarkly.com/integrations/vercel/) to set up the integration.

Next, run Next.js in development mode:

```bash
npm run dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).
