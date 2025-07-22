// components/security/security-provider.tsx

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useSecurity } from '@/hooks/use-security'; // Temporairement désactivé
// import { LicenseInfo } from '@/lib/security/license-system'; // Temporairement désactivé

interface SecurityContextType {
  licenseValid: boolean;
  licenseInfo: any | null; // Temporairement any au lieu de LicenseInfo
  hasFeature: (feature: string) => boolean;
  activateLicense: (licenseKey: string) => Promise<boolean>;
  availableFeatures: string[];
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  // Désactivation temporaire du système de licence
  // const { status, hasFeature, activateLicense } = useSecurity();

  const contextValue: SecurityContextType = {
    licenseValid: true, // Temporairement toujours valide
    licenseInfo: null,
    hasFeature: () => true, // Toutes les fonctionnalités disponibles
    activateLicense: async () => true, // Activation toujours réussie
    availableFeatures: ['all'] // Toutes les fonctionnalités
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
      <SecurityOverlay />
    </SecurityContext.Provider>
  );
}

export function useSecurityContext() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
}

// Composant d'overlay de sécurité (temporairement désactivé)
function SecurityOverlay() {
  // Système de licence désactivé - pas d'overlay pour le moment
  return null;
}
