# 🔒 Système de Protection et Sécurité - Financial Landing

## Vue d'Ensemble

Ce document décrit le système complet de protection mis en place pour sécuriser votre application Financial Landing contre la copie, le vol de code et l'utilisation non autorisée.

## 🛡️ Fonctionnalités de Protection

### 1. Obfuscation du Code
- **Webpack Obfuscator** intégré dans Next.js
- Code JavaScript rendu illisible en production
- Protection contre le debugging
- Contrôle de flux complexifié

### 2. Protection Anti-Copie
- Désactivation du clic droit
- Blocage de la sélection de texte
- Détection des outils de développement
- Watermarking invisible
- Limitation des tentatives de copie

### 3. Système de Licence
- Validation de licence en temps réel
- Contrôle d'accès par fonctionnalité
- Tracking d'utilisation
- Protection par domaine

## 🚀 Installation et Configuration

### Prérequis
```bash
npm install --save-dev webpack-obfuscator javascript-obfuscator
```

### Configuration Automatique
Le système est automatiquement activé via le `SecurityProvider` dans `app/layout.tsx`.

## 📋 Utilisation

### Protection des Fonctionnalités
```tsx
import { FeatureGuard } from '@/components/security/feature-guard';

function PremiumFeature() {
  return (
    <FeatureGuard feature="advanced_generation">
      <div>Contenu premium ici</div>
    </FeatureGuard>
  );
}
```

### Vérification des Licences
```tsx
import { useSecurityContext } from '@/components/security/security-provider';

function MyComponent() {
  const { hasFeature, licenseValid } = useSecurityContext();
  
  if (!licenseValid) {
    return <div>Licence requise</div>;
  }
  
  return (
    <div>
      {hasFeature('premium') && <PremiumContent />}
    </div>
  );
}
```

## 🔧 Configuration Avancée

### Variables d'Environnement
```env
# URL de l'application (pour domain lock)
NEXT_PUBLIC_APP_URL=https://votre-domaine.com

# Clés Supabase pour la gestion des licences
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Personnalisation de l'Obfuscation
Modifiez `next.config.mjs` pour ajuster les paramètres d'obfuscation :

```javascript
new WebpackObfuscator({
  // Niveau d'obfuscation (0.0 à 1.0)
  stringArrayThreshold: 0.8,
  
  // Protection contre le debugging
  debugProtection: true,
  debugProtectionInterval: 2000,
  
  // Contrôle de flux
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75
})
```

## 📊 Types de Licence

| Type | Fonctionnalités | Durée | Prix |
|------|----------------|-------|------|
| **Trial** | Basiques | 30 jours | Gratuit |
| **Personal** | Standard | 1 an | €99 |
| **Commercial** | Avancées | 1 an | €299 |
| **Enterprise** | Complètes | 1 an | €999 |

## 🔍 Fonctionnalités par Licence

### Trial / Gratuit
- ✅ Génération basique
- ✅ 10 générations/jour
- ❌ Export haute qualité
- ❌ API access

### Personal
- ✅ Toutes les fonctionnalités Trial
- ✅ 100 générations/jour
- ✅ Export haute qualité
- ❌ Utilisation commerciale

### Commercial
- ✅ Toutes les fonctionnalités Personal
- ✅ Générations illimitées
- ✅ API access
- ✅ Utilisation commerciale
- ✅ Support prioritaire

### Enterprise
- ✅ Toutes les fonctionnalités Commercial
- ✅ White label
- ✅ Modèles personnalisés
- ✅ Support dédié
- ✅ Déploiement sur site

## 🛠️ Gestion des Licences

### Création d'une Licence
```sql
SELECT * FROM create_license(
  'commercial',                    -- type
  'client-domain.com',            -- domaine
  'client@email.com',             -- email
  'Nom du Client',                -- nom
  365,                            -- durée en jours
  '["basic", "advanced", "api"]'::jsonb,  -- fonctionnalités
  10                              -- max utilisateurs
);
```

### Validation d'une Licence
```sql
SELECT * FROM validate_license(
  'XXXX-XXXX-XXXX-XXXX',         -- clé de licence
  'client-domain.com'             -- domaine
);
```

## 🚨 Détection des Violations

Le système détecte automatiquement :
- Licences expirées
- Utilisation sur domaines non autorisés
- Dépassement du nombre d'utilisateurs
- Tentatives de manipulation

### Gestion des Violations
```sql
-- Voir les violations récentes
SELECT * FROM public.license_violations 
WHERE detected_at > now() - INTERVAL '7 days'
ORDER BY detected_at DESC;
```

## 📈 Analytics et Monitoring

### Statistiques d'Utilisation
```sql
-- Vue des statistiques globales
SELECT * FROM license_stats;

-- Utilisation récente
SELECT * FROM recent_license_usage;
```

### Métriques Importantes
- Nombre de validations par jour
- Domaines actifs
- Fonctionnalités les plus utilisées
- Taux de violation

## 🔒 Sécurité et Bonnes Pratiques

### Protection des Clés API
- ✅ Utilisez des variables d'environnement
- ✅ Ne commitez jamais les fichiers `.env`
- ✅ Utilisez des clés différentes par environnement
- ✅ Rotation régulière des clés

### Monitoring
- ✅ Surveillez les logs de violation
- ✅ Alertes sur les tentatives suspectes
- ✅ Backup régulier des données de licence

### Mise à Jour
- ✅ Mettez à jour régulièrement les dépendances
- ✅ Testez les protections après chaque déploiement
- ✅ Surveillez les nouvelles techniques de contournement

## 🆘 Dépannage

### Problèmes Courants

#### Obfuscation Casse l'Application
```javascript
// Ajoutez des exclusions dans next.config.mjs
reservedNames: [
  '^__next',
  '^React',
  '^votre_fonction_importante'
]
```

#### Licence Non Reconnue
1. Vérifiez la connectivité à Supabase
2. Contrôlez les variables d'environnement
3. Validez le domaine dans la base de données

#### DevTools Toujours Détectés
```javascript
// Ajustez le seuil de détection
const threshold = 200; // Augmentez la valeur
```

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@financial-landing.com
- 📱 Discord : [Lien vers votre serveur]
- 📖 Documentation : [Lien vers docs complètes]

## 📄 Licence

Ce système de protection est propriétaire et protégé par des droits d'auteur.
Toute reproduction ou distribution non autorisée est strictement interdite.

---

© 2024 Financial Landing. Tous droits réservés.
