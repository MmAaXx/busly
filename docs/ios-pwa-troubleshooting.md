# 🍎 Troubleshooting PWA iOS - Busly

## Problèmes courants et solutions pour iOS

### 🔧 Solutions appliquées dans cette version :

## ✅ **URLs absolues**

Tous les chemins vers les icônes et splash screens utilisent maintenant des URLs complètes :

```html
https://mmaaxx.github.io/busly/icons/apple-touch-icon-180x180.png
```

## ✅ **Icône iOS optimisée**

Ajout d'une icône spéciale 180x180px pour iOS :

```html
<link
  rel="apple-touch-icon"
  href="https://mmaaxx.github.io/busly/icons/apple-touch-icon-180x180.png"
/>
```

## ✅ **Splash screens complets**

Tous les écrans de lancement iOS ont des URLs absolues et couvrent :

- iPhone SE, 8, 8 Plus, X/XS, XR, XS Max
- iPad, iPad Pro 10.5", 11", 12.9"

## 📱 **Comment tester après déploiement :**

### 1. Supprimer l'ancienne version

1. **Maintenez** l'icône Busly sur votre écran d'accueil
2. **Sélectionnez** "Supprimer l'app"
3. **Confirmez** la suppression

### 2. Vider le cache Safari

1. **Réglages** → **Safari**
2. **Effacer l'historique et données de sites**
3. **Confirmer**

### 3. Réinstaller l'app

1. **Ouvrez Safari** sur votre iPhone
2. **Allez sur** https://mmaaxx.github.io/busly/
3. **Tapez** le bouton Partager (📤)
4. **Sélectionnez** "Sur l'écran d'accueil"
5. **Tapez** "Ajouter"

### 4. Vérifications

- ✅ **Icône** : Le logo Busly devrait apparaître
- ✅ **Splash screen** : Écran bleu avec logo au démarrage
- ✅ **Mode standalone** : Pas de barre Safari visible

## 🔍 **Si ça ne fonctionne toujours pas :**

### Vérifiez dans Safari :

1. **Ouvrez** https://mmaaxx.github.io/busly/
2. **Menu Développer** (si activé) → **Console Web**
3. **Recherchez** des erreurs 404 sur les icônes

### Testez les URLs directement :

- ✅ https://mmaaxx.github.io/busly/icons/apple-touch-icon-180x180.png
- ✅ https://mmaaxx.github.io/busly/manifest.json
- ✅ https://mmaaxx.github.io/busly/icons/splash-750x1334.png

### Si les icônes ne se chargent pas :

1. **Attendez** quelques minutes (cache CDN)
2. **Réessayez** l'installation
3. **Redémarrez** votre iPhone

## 🎯 **Checklist iOS PWA :**

- [ ] URLs absolues utilisées partout
- [ ] Icône 180x180px présente
- [ ] Splash screens pour votre modèle d'iPhone
- [ ] HTTPS activé (GitHub Pages ✅)
- [ ] Cache Safari vidé
- [ ] Ancienne version supprimée
- [ ] Nouvelle installation effectuée

## 📋 **Spécificités iOS :**

### **Cache agressif**

iOS cache fortement les PWA. En cas de problème :

1. Supprimez l'app
2. Videz le cache Safari
3. Attendez 5-10 minutes
4. Réinstallez

### **Tailles d'icônes**

iOS préfère ces tailles dans cet ordre :

1. **180x180** (priorité absolue)
2. **192x192** (fallback)
3. **152x152** (ancien iOS)

### **Format des splash screens**

iOS nécessite des images exactes pour chaque appareil avec des media queries précises.

---

> 💡 **Astuce** : Si vous voyez encore l'icône par défaut, c'est probablement un problème de cache. Patience et nettoyage du cache sont les clés ! 🧹
