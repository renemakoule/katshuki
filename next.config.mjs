import { withSentryConfig } from "@sentry/nextjs";
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
            process.env.NEXT_PUBLIC_APP_URL?.replace(/https?:\/\//, '') || 'localhost'
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

// Sentry temporairement désactivé pour éviter les conflits avec SecurityProvider
// export default withSentryConfig(nextConfig, {
//   org: "codeium-oss",
//   project: "windsurf",
//   silent: !process.env.CI,
//   widenClientFileUpload: true,
//   reactComponentAnnotation: {
//     enabled: true,
//   },
//   hideSourceMaps: true,
//   disableLogger: true,
//   automaticVercelMonitors: true,
// });

export default withSentryConfig(nextConfig, {
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
});