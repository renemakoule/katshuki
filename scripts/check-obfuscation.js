// scripts/check-obfuscation.js
// Script simple pour vérifier l'obfuscation

const fs = require('fs');
const path = require('path');

function findJSFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findJSFiles(fullPath, files);
    } else if (item.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function checkObfuscation() {
  console.log('🔍 Vérification de l\'obfuscation...\n');
  
  const buildDir = path.join(__dirname, '..', '.next');
  
  if (!fs.existsSync(buildDir)) {
    console.log('❌ Dossier .next non trouvé');
    console.log('   Exécutez: npm run build');
    return false;
  }
  
  // Chercher tous les fichiers JS
  const jsFiles = findJSFiles(buildDir);
  
  if (jsFiles.length === 0) {
    console.log('❌ Aucun fichier JS trouvé');
    return false;
  }
  
  console.log(`📁 ${jsFiles.length} fichiers JS trouvés`);
  
  let obfuscatedCount = 0;
  
  // Vérifier chaque fichier
  for (const file of jsFiles.slice(0, 5)) { // Limiter à 5 fichiers pour la performance
    try {
      const content = fs.readFileSync(file, 'utf8');
      const fileName = path.basename(file);
      
      // Signes d'obfuscation
      const signs = {
        hexNumbers: /0x[0-9a-f]{2,}/gi,
        obfuscatedVars: /_0x[0-9a-f]+/gi,
        stringArrays: /\[.*?0x[0-9a-f]+.*?\]/gi,
        encodedStrings: /\\x[0-9a-f]{2}/gi
      };
      
      let isObfuscated = false;
      const detectedSigns = [];
      
      for (const [name, pattern] of Object.entries(signs)) {
        const matches = content.match(pattern);
        if (matches && matches.length > 5) { // Au moins 5 occurrences
          isObfuscated = true;
          detectedSigns.push(`${name}: ${matches.length}`);
        }
      }
      
      if (isObfuscated) {
        console.log(`✅ ${fileName} - Obfusqué (${detectedSigns.join(', ')})`);
        obfuscatedCount++;
      } else {
        console.log(`⚠️  ${fileName} - Non obfusqué`);
      }
      
    } catch (error) {
      console.log(`❌ Erreur lecture ${path.basename(file)}: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Résultat: ${obfuscatedCount}/${Math.min(jsFiles.length, 5)} fichiers obfusqués`);
  
  if (obfuscatedCount > 0) {
    console.log('🎉 Obfuscation détectée avec succès !');
    return true;
  } else {
    console.log('⚠️  Aucune obfuscation détectée');
    console.log('\n💡 Conseils:');
    console.log('   - Vérifiez que NODE_ENV=production');
    console.log('   - L\'obfuscation ne s\'applique qu\'au code client');
    console.log('   - Certains fichiers peuvent être exclus');
    return false;
  }
}

if (require.main === module) {
  checkObfuscation();
}

module.exports = { checkObfuscation };
