// scripts/enable-obfuscation.js
// Script pour réactiver l'obfuscation après installation du package

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'next.config.mjs');

// Configuration complète avec obfuscation
const obfuscatedConfig = `import { withSentryConfig } from "@sentry/nextjs";
import WebpackObfuscator from 'webpack-obfuscator';

let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Obfuscation uniquement en production et côté client
    if (!dev && !isServer) {
      config.plugins.push(
        new WebpackObfuscator({
          // Configuration d'obfuscation avancée
          rotateStringArray: true,
          stringArray: true,
          stringArrayThreshold: 0.8,
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          splitStrings: true,
          splitStringsChunkLength: 5,
          
          // Obfuscation des identifiants
          identifierNamesGenerator: 'hexadecimal',
          renameGlobals: false,
          renameProperties: false,
          
          // Protection contre le debugging
          debugProtection: true,
          debugProtectionInterval: 2000,
          disableConsoleOutput: true,
          
          // Contrôle de flux
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.4,
          
          // Transformations
          transformObjectKeys: true,
          unicodeEscapeSequence: false,
          
          // Exclusions pour éviter les erreurs
          reservedNames: [
            '^__next',
            '^__NEXT_',
            '^next',
            '^React',
            '^_react',
            '^_app',
            '^_document'
          ],
          
          // Domaines autorisés (optionnel)
          domainLock: process.env.NODE_ENV === 'production' ? [
            process.env.NEXT_PUBLIC_APP_URL?.replace(/https?:\\/\\//, '') || 'localhost'
          ] : []
        }, [])
      );
    }
    
    return config;
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default withSentryConfig(nextConfig, {
  org: "codeium-oss",
  project: "windsurf",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});`;

function enableObfuscation() {
  try {
    // Vérifier si webpack-obfuscator est installé
    try {
      require.resolve('webpack-obfuscator');
      console.log('✅ webpack-obfuscator détecté');
    } catch (e) {
      console.error('❌ webpack-obfuscator non installé. Exécutez: npm install --save-dev webpack-obfuscator');
      process.exit(1);
    }

    // Sauvegarder l'ancien fichier
    const backupPath = configPath + '.backup';
    if (fs.existsSync(configPath)) {
      fs.copyFileSync(configPath, backupPath);
      console.log('📁 Sauvegarde créée:', backupPath);
    }

    // Écrire la nouvelle configuration
    fs.writeFileSync(configPath, obfuscatedConfig);
    console.log('🔒 Obfuscation activée dans next.config.mjs');
    console.log('🚀 Vous pouvez maintenant exécuter: npm run build');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'activation de l\'obfuscation:', error.message);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  enableObfuscation();
}

module.exports = { enableObfuscation };
