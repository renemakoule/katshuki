// lib/security/anti-copy.ts

/**
 * Système de protection anti-copie pour Financial Landing
 * Implémente diverses mesures pour décourager la copie du code
 */

export class AntiCopyProtection {
  private static instance: AntiCopyProtection;
  private devToolsOpen = false;
  private rightClickDisabled = false;
  private selectionDisabled = false;
  private copyAttempts = 0;
  private maxCopyAttempts = 5;

  private constructor() {
    this.init();
  }

  public static getInstance(): AntiCopyProtection {
    if (!AntiCopyProtection.instance) {
      AntiCopyProtection.instance = new AntiCopyProtection();
    }
    return AntiCopyProtection.instance;
  }

  private init() {
    if (typeof window === 'undefined') return;

    this.detectDevTools();
    this.disableRightClick();
    this.disableTextSelection();
    this.disableKeyboardShortcuts();
    this.addWatermark();
    this.detectCopyAttempts();
    this.obfuscateConsole();
  }

  /**
   * Détection des outils de développement
   */
  private detectDevTools() {
    const threshold = 160;
    
    const detectDevTools = () => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!this.devToolsOpen) {
          this.devToolsOpen = true;
          this.handleDevToolsDetected();
        }
      } else {
        this.devToolsOpen = false;
      }
    };

    // Vérification périodique
    setInterval(detectDevTools, 500);

    // Détection par console.log
    let devtools = { open: false, orientation: null };
    const threshold2 = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold2 || 
          window.outerWidth - window.innerWidth > threshold2) {
        if (!devtools.open) {
          devtools.open = true;
          this.handleDevToolsDetected();
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }

  /**
   * Gestion de la détection des DevTools
   */
  private handleDevToolsDetected() {
    console.clear();
    console.log('%c⚠️ AVERTISSEMENT DE SÉCURITÉ', 'color: red; font-size: 20px; font-weight: bold;');
    console.log('%c🔒 Ce contenu est protégé par des droits d\'auteur', 'color: orange; font-size: 14px;');
    console.log('%c📧 Contact: support@financial-landing.com', 'color: blue; font-size: 12px;');
    
    // Optionnel: rediriger ou masquer le contenu
    if (process.env.NODE_ENV === 'production') {
      document.body.style.filter = 'blur(5px)';
      setTimeout(() => {
        document.body.style.filter = 'none';
      }, 3000);
    }
  }

  /**
   * Désactiver le clic droit
   */
  private disableRightClick() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showProtectionMessage('Clic droit désactivé pour protéger le contenu');
      return false;
    });

    this.rightClickDisabled = true;
  }

  /**
   * Désactiver la sélection de texte
   */
  private disableTextSelection() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      
      input, textarea, [contenteditable] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    this.selectionDisabled = true;
  }

  /**
   * Désactiver les raccourcis clavier dangereux
   */
  private disableKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+U (voir source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        this.showProtectionMessage('Affichage du code source désactivé');
        return false;
      }

      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        this.handleDevToolsDetected();
        return false;
      }

      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        this.handleDevToolsDetected();
        return false;
      }

      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        this.handleDevToolsDetected();
        return false;
      }

      // Ctrl+A (Sélectionner tout)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        this.showProtectionMessage('Sélection globale désactivée');
        return false;
      }

      // Ctrl+C (Copier)
      if (e.ctrlKey && e.key === 'c') {
        this.copyAttempts++;
        if (this.copyAttempts > this.maxCopyAttempts) {
          e.preventDefault();
          this.showProtectionMessage('Trop de tentatives de copie détectées');
          return false;
        }
      }
    });
  }

  /**
   * Ajouter un watermark invisible
   */
  private addWatermark() {
    const watermark = document.createElement('div');
    watermark.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;200&quot; height=&quot;200&quot; viewBox=&quot;0 0 200 200&quot;><text x=&quot;50%&quot; y=&quot;50%&quot; font-family=&quot;Arial&quot; font-size=&quot;12&quot; fill=&quot;rgba(0,0,0,0.05)&quot; text-anchor=&quot;middle&quot; dominant-baseline=&quot;middle&quot; transform=&quot;rotate(-45 100 100)&quot;>© Financial Landing ${new Date().getFullYear()}</text></svg>');
        background-repeat: repeat;
        opacity: 0.3;
      "></div>
    `;
    document.body.appendChild(watermark);
  }

  /**
   * Détecter les tentatives de copie
   */
  private detectCopyAttempts() {
    document.addEventListener('copy', (e) => {
      this.copyAttempts++;
      console.log(`Tentative de copie détectée (${this.copyAttempts}/${this.maxCopyAttempts})`);
      
      if (this.copyAttempts > this.maxCopyAttempts) {
        e.preventDefault();
        this.showProtectionMessage('Limite de copie atteinte');
      }
    });

    // Reset du compteur après 5 minutes
    setInterval(() => {
      this.copyAttempts = 0;
    }, 5 * 60 * 1000);
  }

  /**
   * Obfusquer la console
   */
  private obfuscateConsole() {
    if (process.env.NODE_ENV === 'production') {
      // Redéfinir console.log
      const originalLog = console.log;
      console.log = (...args) => {
        originalLog('%c🔒 Console protégée', 'color: red; font-weight: bold;');
      };

      // Nettoyer la console périodiquement
      setInterval(() => {
        console.clear();
      }, 10000);
    }
  }

  /**
   * Afficher un message de protection
   */
  private showProtectionMessage(message: string) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span>🔒</span>
        <span>${message}</span>
      </div>
    `;

    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Supprimer après 3 secondes
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /**
   * Activer/désactiver les protections
   */
  public toggleProtection(enabled: boolean) {
    if (enabled) {
      this.init();
    } else {
      // Réactiver les fonctionnalités (pour les administrateurs)
      document.removeEventListener('contextmenu', () => {});
      this.rightClickDisabled = false;
      this.selectionDisabled = false;
    }
  }

  /**
   * Obtenir le statut des protections
   */
  public getStatus() {
    return {
      devToolsOpen: this.devToolsOpen,
      rightClickDisabled: this.rightClickDisabled,
      selectionDisabled: this.selectionDisabled,
      copyAttempts: this.copyAttempts,
      maxCopyAttempts: this.maxCopyAttempts
    };
  }
}

// Export de l'instance singleton
export const antiCopyProtection = AntiCopyProtection.getInstance();
