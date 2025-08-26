# 🧪 Test des Splash Screens iOS - Guide détaillé

## 🔍 Pourquoi les splash screens ne s'affichent pas ?

### **Causes communes :**
1. **App pas complètement fermée** - iOS réutilise l'instance existante
2. **Media queries incorrectes** - Dimensions exactes requises
3. **Cache iOS** - Très persistant pour les PWA
4. **Mauvais format d'image** - Doit être PNG sans transparence

## ✅ **Méthode de test correcte :**

### **Étape 1 : Installation propre**
1. **Supprimez** l'ancienne app Busly de l'écran d'accueil
2. **Safari** → **Réglages** → **Effacer historique et données**
3. **Redémarrez** votre iPhone (optionnel mais recommandé)

### **Étape 2 : Installation**
1. **Ouvrez Safari**
2. **Allez sur** https://mmaaxx.github.io/busly/
3. **Partager** → **Sur l'écran d'accueil** → **Ajouter**

### **Étape 3 : Test du splash screen** 
1. **NE PAS** lancer l'app immédiatement
2. **Fermez Safari complètement** :
   - Double-tap bouton home
   - Swipez Safari vers le haut pour le fermer
3. **Attendez 10-15 secondes**
4. **Lancez Busly** depuis l'écran d'accueil
5. **Observez** : vous devriez voir un écran bleu avec le logo

## 🔧 **Debugging étapes :**

### **Si pas de splash screen :**

#### **Test 1 : Vérifier les images**
Testez ces URLs directement dans Safari :
- ✅ https://mmaaxx.github.io/busly/icons/test-splash-750x1334.png
- ✅ https://mmaaxx.github.io/busly/icons/splash-1125x2436.png

#### **Test 2 : Vérifier votre modèle d'iPhone**
**Réglages** → **Général** → **Informations** → **Nom du modèle**

| iPhone | Largeur | Hauteur | Pixel Ratio | Image attendue |
|--------|---------|---------|-------------|----------------|
| SE (2020/2022) | 375px | 667px | 2 | test-splash-750x1334.png |
| 8, 7, 6s, 6 | 375px | 667px | 2 | test-splash-750x1334.png |
| X, XS, 11 Pro | 375px | 812px | 3 | splash-1125x2436.png |
| 12, 13, 14, 15 | 393px | 852px | 3 | splash-1179x2556.png |

#### **Test 3 : Media queries**
Dans Safari, **ouvrez la console** (Développer → Console Web) et tapez :
```javascript
console.log(`Screen: ${screen.width}x${screen.height}, Ratio: ${window.devicePixelRatio}`);
```

#### **Test 4 : Page de test simplifiée**
Allez sur : https://mmaaxx.github.io/busly/test-splash.html
Cette page a une configuration minimal pour tester.

## 📱 **Spécificités par modèle :**

### **iPhone SE / 8 / 7 / 6s / 6**
- Media query : `(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)`
- Image : `test-splash-750x1334.png` (750×1334px)

### **iPhone X / XS / 11 Pro**
- Media query : `(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)`
- Image : `splash-1125x2436.png` (1125×2436px)

### **iPhone 12/13/14/15 standard**
- Media query : `(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)`
- Image : `splash-1179x2556.png` (1179×2556px)

## 🚨 **Limitations iOS :**

### **Ce qui ne fonctionne PAS :**
- ❌ GIF animés
- ❌ Images avec transparence
- ❌ SVG
- ❌ Splash screen si l'app est déjà en mémoire

### **Ce qui fonctionne :**
- ✅ PNG sans transparence uniquement
- ✅ Dimensions exactes pour chaque appareil
- ✅ URLs absolues
- ✅ App fermée puis relancée

## 🎯 **Test final :**

Si ça ne marche toujours pas après avoir suivi toutes les étapes :

1. **Quel iPhone** avez-vous exactement ?
2. **Quelle version iOS** ?
3. **Avez-vous vu** l'image test-splash-750x1334.png s'afficher dans Safari ?
4. **L'app se lance-t-elle** en mode standalone (sans barre Safari) ?

---

> 💡 **Note importante** : Les splash screens iOS sont très capricieux. Même avec une configuration parfaite, ils peuvent ne pas s'afficher systématiquement. C'est une limitation connue d'iOS, pas de votre app ! 🤷‍♂️
