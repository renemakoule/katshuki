// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  // Adjust this value in production, or use tracesSampler for finer control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,
  // This sets the sample rate to 100% when sampling sessions where errors occur.
  replaysSessionSampleRate: 0.1,
  // This sets the sample rate to 10%. You may want this to be lower in production.
});
