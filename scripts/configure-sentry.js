// scripts/configure-sentry.js
// Script pour configurer Sentry de manière compatible avec SecurityProvider

const fs = require('fs');
const path = require('path');

function configureSentry() {
  console.log('🔧 Configuration de Sentry compatible avec SecurityProvider...\n');

  // 1. Créer le fichier d'instrumentation
  const instrumentationContent = `// instrumentation.ts
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
}`;

  const instrumentationPath = path.join(__dirname, '..', 'instrumentation.ts');
  fs.writeFileSync(instrumentationPath, instrumentationContent);
  console.log('✅ instrumentation.ts créé');

  // 2. Modifier sentry.server.config.ts pour éviter les conflits
  const serverConfigContent = `// sentry.server.config.ts
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
});`;

  const serverConfigPath = path.join(__dirname, '..', 'sentry.server.config.ts');
  fs.writeFileSync(serverConfigPath, serverConfigContent);
  console.log('✅ sentry.server.config.ts mis à jour');

  // 3. Modifier sentry.client.config.ts
  const clientConfigContent = `// sentry.client.config.ts
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
});`;

  const clientConfigPath = path.join(__dirname, '..', 'sentry.client.config.ts');
  fs.writeFileSync(clientConfigPath, clientConfigContent);
  console.log('✅ sentry.client.config.ts mis à jour');

  // 4. Créer global-error.tsx pour capturer les erreurs React
  const globalErrorContent = `// app/global-error.tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Ne pas envoyer les erreurs de notre système de sécurité
    if (!error.message.includes('SecurityProvider') && 
        !error.message.includes('anti-copy') &&
        !error.message.includes('DevTools')) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2>🚨 Une erreur est survenue</h2>
          <p>Nous nous excusons pour ce désagrément.</p>
          <button
            onClick={reset}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}`;

  const globalErrorPath = path.join(__dirname, '..', 'app', 'global-error.tsx');
  fs.writeFileSync(globalErrorPath, globalErrorContent);
  console.log('✅ app/global-error.tsx créé');

  // 5. Mettre à jour next.config.mjs avec Sentry compatible
  const nextConfigPath = path.join(__dirname, '..', 'next.config.mjs');
  let nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Réactiver Sentry avec configuration compatible
  const sentryConfig = `export default withSentryConfig(nextConfig, {
  org: "codeium-oss",
  project: "windsurf",
  silent: !process.env.CI,
  
  // Réduire l'instrumentation automatique
  autoInstrumentServerFunctions: false,
  autoInstrumentMiddleware: false,
  
  // Configuration compatible avec SecurityProvider
  widenClientFileUpload: false,
  hideSourceMaps: true,
  disableLogger: true,
  
  // Exclure nos fichiers de sécurité de l'instrumentation
  excludeServerRoutes: [
    '/api/license/*'
  ]
});`;
  
  nextConfigContent = nextConfigContent.replace(
    'export default nextConfig;',
    sentryConfig
  );
  
  fs.writeFileSync(nextConfigPath, nextConfigContent);
  console.log('✅ next.config.mjs mis à jour avec Sentry compatible');

  console.log('\n🎉 Configuration Sentry terminée !');
  console.log('\n📋 Prochaines étapes :');
  console.log('   1. Définissez NEXT_PUBLIC_SENTRY_DSN dans .env.local');
  console.log('   2. Exécutez : npm run build');
  console.log('   3. Les erreurs Sentry devraient disparaître');
}

if (require.main === module) {
  configureSentry();
}

module.exports = { configureSentry };
