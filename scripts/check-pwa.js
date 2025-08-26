#!/usr/bin/env node
/**
 * Script pour vérifier la configuration PWA
 * Valide le manifest.json et vérifie la présence des assets
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

// Couleurs pour le terminal
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  title: (msg) =>
    console.log(`\n${colors.bold}${colors.blue}🔍 ${msg}${colors.reset}`),
};

function checkFileExists(filePath, description) {
  const fullPath = path.join(projectRoot, "public", filePath);
  if (fs.existsSync(fullPath)) {
    log.success(`${description} présent`);
    return true;
  } else {
    log.error(`${description} manquant: ${filePath}`);
    return false;
  }
}

function checkManifest() {
  log.title("Vérification du manifest.json");

  const manifestPath = path.join(projectRoot, "public", "manifest.json");

  if (!fs.existsSync(manifestPath)) {
    log.error("manifest.json manquant");
    return false;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    // Vérifications requises
    const required = ["name", "short_name", "start_url", "display", "icons"];
    let valid = true;

    required.forEach((field) => {
      if (manifest[field]) {
        log.success(`Champ "${field}" présent`);
      } else {
        log.error(`Champ requis "${field}" manquant`);
        valid = false;
      }
    });

    // Vérifier les icônes
    if (manifest.icons && manifest.icons.length > 0) {
      log.success(`${manifest.icons.length} icônes définies`);

             manifest.icons.forEach((icon) => {
         const iconPath = icon.src.replace("https://mmaaxx.github.io/busly/", "").replace("/busly/", "");
         if (!checkFileExists(iconPath, `Icône ${icon.sizes}`)) {
           valid = false;
         }
       });
    } else {
      log.error("Aucune icône définie");
      valid = false;
    }

    return valid;
  } catch (error) {
    log.error(`Erreur lors de la lecture du manifest: ${error.message}`);
    return false;
  }
}

function checkIcons() {
  log.title("Vérification des icônes");

  const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
  let allPresent = true;

  iconSizes.forEach((size) => {
    const iconPath = `icons/icon-${size}x${size}.png`;
    if (!checkFileExists(iconPath, `Icône ${size}x${size}`)) {
      allPresent = false;
    }
  });

  // Vérifier les favicons
  const faviconSizes = [16, 32, 48];
  faviconSizes.forEach((size) => {
    const faviconPath = `icons/favicon-${size}x${size}.png`;
    if (!checkFileExists(faviconPath, `Favicon ${size}x${size}`)) {
      allPresent = false;
    }
  });

  // Vérifier favicon.ico
  if (!checkFileExists("favicon.ico", "Favicon ICO")) {
    allPresent = false;
  }

  return allPresent;
}

function checkSplashScreens() {
  log.title("Vérification des écrans de lancement");

  const splashScreens = [
    "splash-640x1136.png", // iPhone SE
    "splash-750x1334.png", // iPhone 8
    "splash-1242x2208.png", // iPhone 8 Plus
    "splash-1125x2436.png", // iPhone X/XS
    "splash-828x1792.png", // iPhone XR
    "splash-1242x2688.png", // iPhone XS Max
    "splash-1536x2048.png", // iPad
    "splash-1668x2224.png", // iPad Pro 10.5"
    "splash-1668x2388.png", // iPad Pro 11"
    "splash-2048x2732.png", // iPad Pro 12.9"
  ];

  let allPresent = true;

  splashScreens.forEach((splash) => {
    const splashPath = `icons/${splash}`;
    if (!checkFileExists(splashPath, `Splash screen ${splash}`)) {
      allPresent = false;
    }
  });

  return allPresent;
}

function checkIndexHtml() {
  log.title("Vérification de index.html");

  const indexPath = path.join(projectRoot, "index.html");

  if (!fs.existsSync(indexPath)) {
    log.error("index.html manquant");
    return false;
  }

  const content = fs.readFileSync(indexPath, "utf8");

  // Vérifications PWA
  const checks = [
    { pattern: /<link rel="manifest"/, description: "Lien vers manifest.json" },
    {
      pattern: /<meta name="theme-color"/,
      description: "Meta tag theme-color",
    },
    {
      pattern: /<link rel="apple-touch-icon"/,
      description: "Icônes Apple Touch",
    },
    {
      pattern: /<meta name="apple-mobile-web-app-capable"/,
      description: "Meta tags Apple PWA",
    },
    {
      pattern: /<link rel="apple-touch-startup-image"/,
      description: "Splash screens iOS",
    },
  ];

  let valid = true;

  checks.forEach((check) => {
    if (check.pattern.test(content)) {
      log.success(check.description);
    } else {
      log.error(`${check.description} manquant`);
      valid = false;
    }
  });

  return valid;
}

function main() {
  console.log(
    `${colors.bold}${colors.blue}🚀 Vérification de la configuration PWA de Busly${colors.reset}\n`
  );

  const results = {
    manifest: checkManifest(),
    icons: checkIcons(),
    splash: checkSplashScreens(),
    html: checkIndexHtml(),
  };

  const allValid = Object.values(results).every((result) => result);

  log.title("Résumé");

  if (allValid) {
    log.success("Configuration PWA complète et valide ! 🎉");
    log.info("Votre app est prête à être installée comme PWA");
  } else {
    log.error("Certains éléments PWA sont manquants ou invalides");
    log.info("Utilisez les scripts de génération : npm run generate:pwa");
  }

  return allValid;
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = main();
  process.exit(success ? 0 : 1);
}
