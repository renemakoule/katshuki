// Configuration temporaire pour désactiver le système de licence
export const LICENSE_CONFIG = {
  // Système de licence temporairement désactivé
  ENABLED: false,
  
  // Mode de développement - toutes les fonctionnalités disponibles
  DEV_MODE: true,
  
  // Fonctionnalités disponibles en mode désactivé
  DEFAULT_FEATURES: [
    'all',
    'advanced_generation',
    'bulk_operations', 
    'api_access',
    'white_label',
    'custom_models',
    'priority_support',
    'analytics',
    'team_collaboration'
  ],
  
  // Licence par défaut en mode désactivé
  DEFAULT_LICENSE: {
    valid: true,
    type: 'enterprise',
    expiresAt: '2025-12-31T23:59:59Z',
    features: ['all']
  }
};

// Helper pour vérifier si le système de licence est activé
export function isLicenseSystemEnabled(): boolean {
  return LICENSE_CONFIG.ENABLED;
}

// Helper pour obtenir les fonctionnalités par défaut
export function getDefaultFeatures(): string[] {
  return LICENSE_CONFIG.DEFAULT_FEATURES;
}

// Helper pour obtenir la licence par défaut
export function getDefaultLicense() {
  return LICENSE_CONFIG.DEFAULT_LICENSE;
}
