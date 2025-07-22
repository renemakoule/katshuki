// hooks/use-security.ts

import { useEffect, useState } from 'react';
import { antiCopyProtection } from '@/lib/security/anti-copy';
import { licenseSystem, LicenseInfo } from '@/lib/security/license-system';

interface SecurityStatus {
  antiCopyEnabled: boolean;
  licenseValid: boolean;
  licenseInfo: LicenseInfo | null;
  availableFeatures: string[];
}

export function useSecurity() {
  const [status, setStatus] = useState<SecurityStatus>({
    antiCopyEnabled: false,
    licenseValid: false,
    licenseInfo: null,
    availableFeatures: []
  });

  useEffect(() => {
    // Initialiser les protections anti-copie
    if (typeof window !== 'undefined') {
      // Les protections sont automatiquement activées via le singleton
      const antiCopyStatus = antiCopyProtection.getStatus();
      
      // Obtenir les informations de licence
      const licenseInfo = licenseSystem.getLicenseInfo();
      const availableFeatures = licenseSystem.getAvailableFeatures();

      setStatus({
        antiCopyEnabled: antiCopyStatus.rightClickDisabled,
        licenseValid: licenseInfo?.isValid || false,
        licenseInfo,
        availableFeatures
      });
    }

    // Cleanup lors du démontage
    return () => {
      licenseSystem.destroy();
    };
  }, []);

  const hasFeature = (feature: string): boolean => {
    return licenseSystem.hasFeature(feature);
  };

  const activateLicense = async (licenseKey: string): Promise<boolean> => {
    const success = await licenseSystem.setLicense(licenseKey);
    if (success) {
      const licenseInfo = licenseSystem.getLicenseInfo();
      const availableFeatures = licenseSystem.getAvailableFeatures();
      
      setStatus(prev => ({
        ...prev,
        licenseValid: true,
        licenseInfo,
        availableFeatures
      }));
    }
    return success;
  };

  const toggleAntiCopy = (enabled: boolean) => {
    antiCopyProtection.toggleProtection(enabled);
    setStatus(prev => ({
      ...prev,
      antiCopyEnabled: enabled
    }));
  };

  return {
    status,
    hasFeature,
    activateLicense,
    toggleAntiCopy
  };
}
