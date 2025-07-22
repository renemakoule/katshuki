// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Intégrations minimales pour éviter les conflits
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Debug
  debug: process.env.NODE_ENV === 'development',
  
  // Filtrer les erreurs de notre système de sécurité
  beforeSend(event) {
    // Ignorer les erreurs intentionnelles de notre système anti-copie
    if (event.exception?.values?.[0]?.value?.includes('DevTools')) {
      return null;
    }
    
    if (event.exception?.values?.[0]?.value?.includes('Protection')) {
      return null;
    }
    
    return event;
  }
});