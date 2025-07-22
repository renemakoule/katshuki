// components/security/feature-guard.tsx

'use client';

import React from 'react';
// import { useSecurityContext } from './security-provider'; // Temporairement désactivé
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Zap } from 'lucide-react';

interface FeatureGuardProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

export function FeatureGuard({ 
  feature, 
  children, 
  fallback, 
  showUpgrade = true 
}: FeatureGuardProps) {
  // Système de licence désactivé - toutes les fonctionnalités sont disponibles
  // const { hasFeature, licenseInfo } = useSecurityContext();

  // Temporairement, toutes les fonctionnalités sont accessibles
  return <>{children}</>;

  // Code original commenté :
  /*
  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showUpgrade) {
    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
          <div className="text-center text-white p-4">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-semibold mb-2">Fonctionnalité Premium</h3>
            <p className="text-sm mb-4">
              Cette fonctionnalité nécessite une licence {getRequiredLicenseType(feature)}.
            </p>
            <div className="space-x-2">
              <a 
                href="/license" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm inline-block"
              >
                Mettre à niveau
              </a>
              <a 
                href="/contact" 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm inline-block"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
  */
}

// Fonctions temporairement désactivées
/*
function getRequiredLicenseType(feature: string): string {
  const featureMap: Record<string, string> = {
    'advanced_generation': 'Pro',
    'bulk_operations': 'Pro',
    'api_access': 'Commercial',
    'white_label': 'Enterprise',
    'custom_models': 'Enterprise',
    'priority_support': 'Pro',
    'analytics': 'Commercial',
    'team_collaboration': 'Commercial'
  };

  return featureMap[feature] || 'Pro';
}

// Hook pour vérifier les fonctionnalités dans les composants
export function useFeatureAccess(feature: string) {
  const { hasFeature } = useSecurityContext();
  return hasFeature(feature);
}
*/

// Hook temporairement désactivé - toutes les fonctionnalités sont disponibles
export function useFeatureAccess(feature: string) {
  return true; // Toutes les fonctionnalités sont accessibles
}
