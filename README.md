# LaunchDarkly Feature Flag Apple Store

This template uses Edge Config as fast storage to control whether the store is open or closed.

## Demo

https://edge-functions-feature-flag-apple-store.vercel.app/

## How to Use

#### Set up environment variables

Copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

This example requires you to set up an Edge Config and store its connection string in the `EDGE_CONFIG` environment variable.

Fill the Edge Config you create with this content:

```json
{ "featureFlagsAppleStore_storeClosed": true }
```

Next, run Next.js in development mode:

```bash
npm run dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=edge-middleware-eap) ([Documentation](https://nextjs.org/docs/deployment)).

## Opening / Closing the Store using the Dashboard

You can control whether the store is open or not by changing the value of `featureFlagsAppleStore_storeClosed` using the [Edge Config Dashboard](https://vercel.com/docs/concepts/edge-network/edge-config/edge-config-dashboard#manage-edge-configs).

## Opening / Closing the Store using API Routes

> Note that you need to provide your own `TEAM_ID_VERCEL` and `AUTH_BEARER_TOKEN` environment variables in `.env.local` if you want to open or close the store using the routes shown below.

To open the store go to:

```
http://localhost:3000/api/store/open
```

To close the store go to:

```
http://localhost:3000/api/store/close
```

Alternatively you can use the Edge Config UI in your Vercel dashboard to update the `featureFlagsAppleStore_storeClosed` value directly.
