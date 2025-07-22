// app/global-error.tsx
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
}