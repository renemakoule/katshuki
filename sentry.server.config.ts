// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Réduire l'instrumentation pour éviter les conflits
  integrations: [
    Sentry.httpIntegration(),
    Sentry.nodeContextIntegration(),
  ],
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Debug
  debug: process.env.NODE_ENV === 'development',
  
  // Éviter l'instrumentation automatique qui cause des conflits
  autoInstrumentServerFunctions: false,
  autoInstrumentMiddleware: false,
  
  // Filtrer les erreurs liées à notre système de sécurité
  beforeSend(event) {
    // Ignorer les erreurs de notre système anti-copie
    if (event.exception?.values?.[0]?.value?.includes('SecurityProvider')) {
      return null;
    }
    
    if (event.exception?.values?.[0]?.value?.includes('anti-copy')) {
      return null;
    }
    
    return event;
  }
});