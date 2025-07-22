// lib/security/license-system.ts

/**
 * Système de licence et protection de propriété intellectuelle
 * pour Financial Landing
 */

export interface LicenseInfo {
  id: string;
  type: 'trial' | 'personal' | 'commercial' | 'enterprise';
  domain: string;
  expiresAt: Date;
  features: string[];
  maxUsers: number;
  isValid: boolean;
}

export interface LicenseValidationResult {
  valid: boolean;
  reason?: string;
  remainingDays?: number;
  features: string[];
}

export class LicenseSystem {
  private static instance: LicenseSystem;
  private currentLicense: LicenseInfo | null = null;
  private validationInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.init();
  }

  public static getInstance(): LicenseSystem {
    if (!LicenseSystem.instance) {
      LicenseSystem.instance = new LicenseSystem();
    }
    return LicenseSystem.instance;
  }

  private init() {
    if (typeof window === 'undefined') return;

    this.loadLicense();
    this.startValidationLoop();
    this.addLicenseWatermark();
    this.trackUsage();
  }

  /**
   * Charger la licence depuis le stockage local ou l'API
   */
  private async loadLicense() {
    try {
      // Essayer de charger depuis localStorage
      const storedLicense = localStorage.getItem('financial_landing_license');
      if (storedLicense) {
        const license = JSON.parse(storedLicense);
        this.currentLicense = {
          ...license,
          expiresAt: new Date(license.expiresAt)
        };
      }

      // Valider avec le serveur
      await this.validateWithServer();
    } catch (error) {
      console.error('Erreur lors du chargement de la licence:', error);
      this.handleInvalidLicense('Erreur de chargement de licence');
    }
  }

  /**
   * Valider la licence avec le serveur
   */
  private async validateWithServer(): Promise<LicenseValidationResult> {
    try {
      const response = await fetch('/api/license/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: window.location.hostname,
          licenseId: this.currentLicense?.id,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error('Validation de licence échouée');
      }

      const result: LicenseValidationResult = await response.json();
      
      if (!result.valid) {
        this.handleInvalidLicense(result.reason || 'Licence invalide');
      }

      return result;
    } catch (error) {
      console.error('Erreur de validation de licence:', error);
      return {
        valid: false,
        reason: 'Erreur de connexion au serveur de licence',
        features: []
      };
    }
  }

  /**
   * Démarrer la boucle de validation périodique
   */
  private startValidationLoop() {
    // Validation toutes les 30 minutes
    this.validationInterval = setInterval(async () => {
      await this.validateWithServer();
    }, 30 * 60 * 1000);
  }

  /**
   * Gérer une licence invalide
   */
  private handleInvalidLicense(reason: string) {
    console.error('Licence invalide:', reason);
    
    // Afficher un avertissement
    this.showLicenseWarning(reason);
    
    // Limiter les fonctionnalités
    this.restrictFeatures();
    
    // En production, rediriger vers la page de licence
    if (process.env.NODE_ENV === 'production') {
      setTimeout(() => {
        window.location.href = '/license-required';
      }, 5000);
    }
  }

  /**
   * Afficher un avertissement de licence
   */
  private showLicenseWarning(reason: string) {
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      font-family: Arial, sans-serif;
      text-align: center;
    `;

    warning.innerHTML = `
      <div style="max-width: 500px; padding: 40px;">
        <h1 style="color: #ff4444; margin-bottom: 20px;">⚠️ Licence Requise</h1>
        <p style="font-size: 18px; margin-bottom: 20px;">${reason}</p>
        <p style="margin-bottom: 30px;">
          Cette application est protégée par des droits d'auteur.<br>
          Une licence valide est requise pour continuer.
        </p>
        <div style="margin-bottom: 30px;">
          <a href="/license" style="
            background: #007bff;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            margin: 0 10px;
            display: inline-block;
          ">Obtenir une Licence</a>
          <a href="/contact" style="
            background: #28a745;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            margin: 0 10px;
            display: inline-block;
          ">Nous Contacter</a>
        </div>
        <p style="font-size: 12px; color: #ccc;">
          © ${new Date().getFullYear()} Financial Landing. Tous droits réservés.
        </p>
      </div>
    `;

    document.body.appendChild(warning);
  }

  /**
   * Restreindre les fonctionnalités
   */
  private restrictFeatures() {
    // Désactiver certaines fonctionnalités
    const restrictedElements = document.querySelectorAll('[data-premium="true"]');
    restrictedElements.forEach(element => {
      (element as HTMLElement).style.opacity = '0.5';
      (element as HTMLElement).style.pointerEvents = 'none';
    });

    // Ajouter un overlay sur les fonctionnalités premium
    const premiumElements = document.querySelectorAll('[data-feature="premium"]');
    premiumElements.forEach(element => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        z-index: 1000;
      `;
      overlay.innerHTML = '🔒 Licence Requise';
      
      const parent = element.parentElement;
      if (parent) {
        parent.style.position = 'relative';
        parent.appendChild(overlay);
      }
    });
  }

  /**
   * Ajouter un watermark de licence
   */
  private addLicenseWatermark() {
    const watermark = document.createElement('div');
    watermark.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 5px 10px;
      font-size: 10px;
      border-radius: 4px;
      z-index: 9998;
      font-family: monospace;
      pointer-events: none;
    `;

    const licenseType = this.currentLicense?.type || 'unlicensed';
    const domain = window.location.hostname;
    
    watermark.innerHTML = `© FL ${new Date().getFullYear()} | ${licenseType} | ${domain}`;
    document.body.appendChild(watermark);
  }

  /**
   * Suivre l'utilisation pour les analytics
   */
  private trackUsage() {
    const usage = {
      domain: window.location.hostname,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      licenseId: this.currentLicense?.id || 'none',
      features: this.getAvailableFeatures()
    };

    // Envoyer les données d'utilisation (en arrière-plan)
    fetch('/api/license/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usage)
    }).catch(() => {
      // Ignorer les erreurs de tracking
    });
  }

  /**
   * Obtenir les fonctionnalités disponibles
   */
  public getAvailableFeatures(): string[] {
    if (!this.currentLicense || !this.currentLicense.isValid) {
      return ['basic']; // Fonctionnalités de base seulement
    }

    return this.currentLicense.features;
  }

  /**
   * Vérifier si une fonctionnalité est disponible
   */
  public hasFeature(feature: string): boolean {
    const availableFeatures = this.getAvailableFeatures();
    return availableFeatures.includes(feature) || availableFeatures.includes('all');
  }

  /**
   * Obtenir les informations de licence
   */
  public getLicenseInfo(): LicenseInfo | null {
    return this.currentLicense;
  }

  /**
   * Définir une nouvelle licence
   */
  public async setLicense(licenseKey: string): Promise<boolean> {
    try {
      const response = await fetch('/api/license/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          licenseKey,
          domain: window.location.hostname
        })
      });

      if (!response.ok) {
        throw new Error('Activation de licence échouée');
      }

      const license: LicenseInfo = await response.json();
      this.currentLicense = license;
      
      // Sauvegarder localement
      localStorage.setItem('financial_landing_license', JSON.stringify(license));
      
      // Recharger la page pour appliquer les nouvelles permissions
      window.location.reload();
      
      return true;
    } catch (error) {
      console.error('Erreur d\'activation de licence:', error);
      return false;
    }
  }

  /**
   * Nettoyer les ressources
   */
  public destroy() {
    if (this.validationInterval) {
      clearInterval(this.validationInterval);
    }
  }
}

// Export de l'instance singleton
export const licenseSystem = LicenseSystem.getInstance();
