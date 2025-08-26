# 🛠️ Configuration PWA - Guide Développeur

Cette documentation explique comment configurer et personnaliser les fonctionnalités PWA de Busly.

## 📱 Composants PWA

### 1. Manifest.json

Le fichier `public/manifest.json` définit les métadonnées de l'application :

- **Nom et description** de l'app
- **Icônes** en différentes tailles
- **Couleurs** de thème et d'arrière-plan
- **Mode d'affichage** (standalone)
- **URL de démarrage**

### 2. Icônes PWA

Les icônes sont générées automatiquement à partir du logo principal dans différentes tailles :

- **Icônes d'app** : 72x72 à 512x512 px
- **Favicons** : 16x16, 32x32, 48x48 px
- **Favicon.ico** : 32x32 px

### 3. Écrans de lancement (Splash Screens)

Écrans d'accueil iOS avec le logo centré sur fond coloré :

- **iPhone** : SE, 8, 8 Plus, X/XS, XR, XS Max
- **iPad** : Standard, Pro 10.5", Pro 11", Pro 12.9"
- **Android** : FHD, QHD

## 🔧 Scripts de génération

### Installation des dépendances

```bash
# Installer Pillow pour la manipulation d'images
pip3 install Pillow
```

### Commandes disponibles

#### Générer toutes les ressources PWA

```bash
npm run generate:pwa
```

#### Générer uniquement les icônes

```bash
npm run generate:icons
# ou directement :
python3 scripts/generate-pwa-icons.py
```

#### Générer uniquement les splash screens

```bash
npm run generate:splash
# ou directement :
python3 scripts/generate-splash-screens.py
```

## 🎨 Personnalisation

### Changer le logo

1. Remplacez `public/busly-logo-only.png` par votre nouveau logo
2. Régénérez les assets : `npm run generate:pwa`

### Modifier les couleurs

1. **Manifest.json** : Changez `theme_color` et `background_color`
2. **Index.html** : Mettez à jour les meta tags `theme-color`
3. **Splash screens** : Modifiez `background_color` dans `generate-splash-screens.py`

### Ajouter de nouvelles tailles

Modifiez les arrays `sizes` dans les scripts Python pour ajouter de nouvelles dimensions.

## 📂 Structure des fichiers générés

```
public/
├── manifest.json                 # Configuration PWA
├── favicon.ico                   # Favicon principal
└── icons/
    ├── icon-72x72.png           # Icônes d'app
    ├── icon-96x96.png
    ├── ...
    ├── icon-512x512.png
    ├── favicon-16x16.png        # Favicons
    ├── favicon-32x32.png
    ├── favicon-48x48.png
    ├── splash-640x1136.png      # Écrans de lancement iOS
    ├── splash-750x1334.png
    ├── ...
    └── splash-2048x2732.png
```

## ✅ Vérification PWA

### Outils de test

1. **Chrome DevTools** : Onglet "Application" → "Manifest"
2. **Lighthouse** : Audit PWA automatique
3. **Web App Manifest Validator** : Validation en ligne

### Points à vérifier

- ✅ Manifest.json accessible et valide
- ✅ Icônes de toutes tailles présentes
- ✅ Meta tags PWA correctement configurés
- ✅ HTTPS activé (requis pour PWA)
- ✅ Service Worker fonctionnel (si implémenté)

## 🚀 Déploiement

Les assets PWA sont automatiquement inclus lors du build :

```bash
npm run build  # Inclut tous les assets PWA
npm run deploy # Déploie sur GitHub Pages
```

## 🔍 Troubleshooting

### L'icône n'apparaît pas

- Vérifiez que toutes les tailles d'icônes sont présentes
- Contrôlez les chemins dans `manifest.json`
- Testez sur un vrai appareil (les émulateurs peuvent avoir des bugs)

### Écran de lancement iOS ne fonctionne pas

- Vérifiez les media queries dans `index.html`
- Assurez-vous que les splash screens existent
- iOS peut mettre en cache l'ancienne configuration

### Erreur "Add to Home Screen" non disponible

- HTTPS est requis
- Le manifest doit être valide
- L'app doit satisfaire aux critères PWA de Chrome

---

> 💡 **Astuce** : Pour tester rapidement, utilisez Chrome DevTools → Application → Manifest, puis "Add to Home Screen" pour simuler l'installation PWA.
