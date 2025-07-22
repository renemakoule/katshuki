// instrumentation.ts
import { register } from '@sentry/nextjs';

if (process.env.NEXT_RUNTIME === 'nodejs') {
  register();
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}