// scripts/test-security.js
// Script pour tester toutes les protections de sécurité

const fs = require('fs');
const path = require('path');

console.log('🔒 Test du Système de Protection - Financial Landing\n');

// 1. Vérifier l'obfuscation
function testObfuscation() {
  console.log('1️⃣ Test de l\'Obfuscation...');
  
  const buildDir = path.join(__dirname, '..', '.next');
  if (!fs.existsSync(buildDir)) {
    console.log('   ❌ Dossier .next non trouvé - Exécutez npm run build');
    return false;
  }

  // Chercher des fichiers JS obfusqués
  const staticDir = path.join(buildDir, 'static', 'chunks');
  if (fs.existsSync(staticDir)) {
    const files = fs.readdirSync(staticDir, { recursive: true });
    const jsFiles = files.filter(f => typeof f === 'string' && f.endsWith('.js'));
    
    if (jsFiles.length > 0) {
      const sampleFile = path.join(staticDir, jsFiles[0]);
      const content = fs.readFileSync(sampleFile, 'utf8');
      
      // Vérifier les signes d'obfuscation
      const obfuscationSigns = [
        /0x[0-9a-f]+/i,  // Nombres hexadécimaux
        /_0x[0-9a-f]+/i, // Variables obfusquées
        /\['\\x[0-9a-f]+'\]/i, // Chaînes encodées
      ];
      
      const isObfuscated = obfuscationSigns.some(pattern => pattern.test(content));
      
      if (isObfuscated) {
        console.log('   ✅ Code obfusqué détecté');
        return true;
      } else {
        console.log('   ⚠️  Obfuscation non détectée - Vérifiez la configuration');
        return false;
      }
    }
  }
  
  console.log('   ❌ Fichiers JS non trouvés');
  return false;
}

// 2. Vérifier les fichiers de sécurité
function testSecurityFiles() {
  console.log('\n2️⃣ Test des Fichiers de Sécurité...');
  
  const securityFiles = [
    'lib/security/anti-copy.ts',
    'lib/security/license-system.ts',
    'hooks/use-security.ts',
    'components/security/security-provider.tsx',
    'components/security/feature-guard.tsx',
    'app/api/license/validate/route.ts',
    'app/api/license/track/route.ts',
    'supabase/sql/setup_licenses.sql'
  ];

  let allPresent = true;
  
  securityFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} - MANQUANT`);
      allPresent = false;
    }
  });

  return allPresent;
}

// 3. Vérifier la configuration Next.js
function testNextConfig() {
  console.log('\n3️⃣ Test de la Configuration Next.js...');
  
  const configPath = path.join(__dirname, '..', 'next.config.mjs');
  if (!fs.existsSync(configPath)) {
    console.log('   ❌ next.config.mjs non trouvé');
    return false;
  }

  const content = fs.readFileSync(configPath, 'utf8');
  
  const checks = [
    { name: 'Import WebpackObfuscator', pattern: /import.*WebpackObfuscator.*from.*webpack-obfuscator/ },
    { name: 'Configuration webpack', pattern: /webpack:\s*\(config,\s*\{.*dev.*isServer.*\}\)/ },
    { name: 'Obfuscation conditionnelle', pattern: /if\s*\(!dev\s*&&\s*!isServer\)/ },
    { name: 'SecurityProvider import', pattern: /SecurityProvider/ }
  ];

  let allPassed = true;
  
  checks.forEach(check => {
    if (check.pattern.test(content)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name} - NON CONFIGURÉ`);
      allPassed = false;
    }
  });

  return allPassed;
}

// 4. Vérifier les dépendances
function testDependencies() {
  console.log('\n4️⃣ Test des Dépendances...');
  
  const packagePath = path.join(__dirname, '..', 'package.json');
  if (!fs.existsSync(packagePath)) {
    console.log('   ❌ package.json non trouvé');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const devDeps = packageJson.devDependencies || {};
  
  const requiredDeps = [
    'webpack-obfuscator',
    'javascript-obfuscator'
  ];

  let allInstalled = true;
  
  requiredDeps.forEach(dep => {
    if (devDeps[dep]) {
      console.log(`   ✅ ${dep} v${devDeps[dep]}`);
    } else {
      console.log(`   ❌ ${dep} - NON INSTALLÉ`);
      allInstalled = false;
    }
  });

  return allInstalled;
}

// 5. Test de l'intégration dans layout.tsx
function testLayoutIntegration() {
  console.log('\n5️⃣ Test de l\'Intégration Layout...');
  
  const layoutPath = path.join(__dirname, '..', 'app', 'layout.tsx');
  if (!fs.existsSync(layoutPath)) {
    console.log('   ❌ app/layout.tsx non trouvé');
    return false;
  }

  const content = fs.readFileSync(layoutPath, 'utf8');
  
  const checks = [
    { name: 'Import SecurityProvider', pattern: /import.*SecurityProvider.*from.*security-provider/ },
    { name: 'Wrapper SecurityProvider', pattern: /<SecurityProvider>/ }
  ];

  let allPassed = true;
  
  checks.forEach(check => {
    if (check.pattern.test(content)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name} - NON INTÉGRÉ`);
      allPassed = false;
    }
  });

  return allPassed;
}

// Exécuter tous les tests
function runAllTests() {
  const results = [
    testObfuscation(),
    testSecurityFiles(),
    testNextConfig(),
    testDependencies(),
    testLayoutIntegration()
  ];

  const passed = results.filter(r => r).length;
  const total = results.length;

  console.log(`\n📊 Résultats: ${passed}/${total} tests réussis`);
  
  if (passed === total) {
    console.log('🎉 Toutes les protections sont correctement configurées !');
    console.log('\n🚀 Prochaines étapes:');
    console.log('   1. Exécutez: npm run build');
    console.log('   2. Déployez en production');
    console.log('   3. Testez les protections dans le navigateur');
  } else {
    console.log('⚠️  Certaines protections nécessitent une attention');
    console.log('\n🔧 Actions recommandées:');
    if (!results[0]) console.log('   - Vérifiez la configuration d\'obfuscation');
    if (!results[1]) console.log('   - Vérifiez que tous les fichiers de sécurité sont présents');
    if (!results[2]) console.log('   - Corrigez la configuration Next.js');
    if (!results[3]) console.log('   - Installez les dépendances manquantes');
    if (!results[4]) console.log('   - Intégrez SecurityProvider dans layout.tsx');
  }

  return passed === total;
}

// Exécuter si appelé directement
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };
