# 🚌 Busly - Horaires de Bus

Une application React simple et moderne pour consulter rapidement les horaires de bus. Parfaite pour aider votre enfant à consulter les horaires pour aller au collège !

## ✨ Fonctionnalités

- 📱 Interface moderne et responsive
- 🕐 Affichage en temps réel des prochains départs
- 📅 Gestion automatique des différents types de jours (semaine/samedi/dimanche)
- 🎨 Design coloré et intuitif
- ⚡ Application rapide et légère

## 🚀 Déploiement

L'application est automatiquement déployée sur GitHub Pages à chaque push sur la branche `main`.

### URL de l'application

Une fois déployée, l'application sera accessible à l'adresse :

```
https://donjgo.github.io/busly
```

## 🛠️ Développement local

### Prérequis

- Node.js (version 18 ou plus récente)
- npm

### Installation

```bash
# Cloner le repository
git clone https://github.com/donjgo/bus-hours.git
cd bus-hours

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible à l'adresse `http://localhost:5173`

## 📊 Structure des données

Les horaires sont stockés dans `src/data/bus-lines.json`. Vous pouvez facilement modifier ce fichier pour ajouter vos propres lignes et horaires.

### Format des données

```json
{
  "lines": [
    {
      "id": "ligne-1",
      "name": "Ligne 1",
      "color": "#FF6B6B",
      "direction1": {
        "name": "Collège → Centre-ville",
        "stops": [
          {
            "name": "Collège Jean Moulin",
            "schedule": {
              "weekdays": ["07:15", "07:45", "08:15"],
              "saturday": ["08:00", "09:00", "10:00"],
              "sunday": ["09:00", "11:00", "14:00"]
            }
          }
        ]
      }
    }
  ]
}
```

## 🎨 Personnalisation

- **Couleurs des lignes** : Modifiez la propriété `color` de chaque ligne
- **Horaires** : Mettez à jour le fichier `bus-lines.json`
- **Style** : Personnalisez les couleurs et le design dans `src/App.css`

## 📝 Scripts disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Construire l'application pour la production
- `npm run preview` - Prévisualiser la version de production
- `npm run deploy` - Déployer manuellement sur GitHub Pages

## 🔧 Technologies utilisées

- React 19
- Vite
- CSS moderne avec Grid et Flexbox
- GitHub Actions pour le déploiement automatique
- GitHub Pages pour l'hébergement

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte parfaitement aux :

- 📱 Smartphones
- 📱 Tablettes
- 💻 Ordinateurs de bureau

## Comment importer les horaires

Pour importer les horaires on part des fichiers PDF disponible sur le site Arc-en-ciel.

On transforme le PDF en CSV pour que l'IA puisse facilement le transformer dans le fichier JSON attendu pour servir les données de l'app.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le project
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est libre d'utilisation pour un usage personnel et éducatif.
