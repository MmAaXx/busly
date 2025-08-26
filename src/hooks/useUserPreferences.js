import { useState, useEffect } from "react";

// Clés pour le localStorage
const STORAGE_KEYS = {
  FAVORITE_STOPS: "bus-hours-favorite-stops",
  RECENT_TRIPS: "bus-hours-recent-trips",
  LAST_TRIP: "bus-hours-last-trip",
  LAST_SEARCH: "bus-hours-last-search",
};

const useUserPreferences = () => {
  const [favoriteStops, setFavoriteStops] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [lastTrip, setLastTrip] = useState(null);
  const [lastSearch, setLastSearch] = useState(null);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedStops = localStorage.getItem(STORAGE_KEYS.FAVORITE_STOPS);
      const savedTrips = localStorage.getItem(STORAGE_KEYS.RECENT_TRIPS);
      const savedLastTrip = localStorage.getItem(STORAGE_KEYS.LAST_TRIP);
      const savedLastSearch = localStorage.getItem(STORAGE_KEYS.LAST_SEARCH);

      if (savedStops) {
        setFavoriteStops(JSON.parse(savedStops));
      }
      if (savedTrips) {
        setRecentTrips(JSON.parse(savedTrips));
      }
      if (savedLastTrip) {
        setLastTrip(JSON.parse(savedLastTrip));
      }
      if (savedLastSearch) {
        setLastSearch(JSON.parse(savedLastSearch));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des préférences:", error);
    }
  }, []);

  // Sauvegarder dans localStorage
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  // Ajouter un arrêt aux favoris
  const addFavoriteStop = (stopData) => {
    const newStop = {
      id: `${stopData.lineId}-${stopData.stopName}`,
      lineId: stopData.lineId,
      lineName: stopData.lineName,
      lineColor: stopData.lineColor,
      stopName: stopData.stopName,
      direction: stopData.direction,
      directionName: stopData.directionName,
      addedAt: new Date().toISOString(),
    };

    const existingIndex = favoriteStops.findIndex(
      (stop) => stop.id === newStop.id
    );
    let updatedStops;

    if (existingIndex === -1) {
      updatedStops = [...favoriteStops, newStop];
    } else {
      updatedStops = favoriteStops;
    }

    setFavoriteStops(updatedStops);
    saveToStorage(STORAGE_KEYS.FAVORITE_STOPS, updatedStops);
    return existingIndex === -1;
  };

  // Retirer un arrêt des favoris
  const removeFavoriteStop = (stopId) => {
    const updatedStops = favoriteStops.filter((stop) => stop.id !== stopId);
    setFavoriteStops(updatedStops);
    saveToStorage(STORAGE_KEYS.FAVORITE_STOPS, updatedStops);
  };

  // Vérifier si un arrêt est en favori
  const isFavoriteStop = (lineId, stopName) => {
    const stopId = `${lineId}-${stopName}`;
    return favoriteStops.some((stop) => stop.id === stopId);
  };

  // Sauvegarder un trajet (départ → arrivée)
  const saveTrip = (tripData) => {
    const newTrip = {
      id: `${tripData.fromStop.lineId}-${tripData.fromStop.stopName}-to-${tripData.toStop.lineId}-${tripData.toStop.stopName}`,
      fromStop: {
        lineId: tripData.fromStop.lineId,
        lineName: tripData.fromStop.lineName,
        lineColor: tripData.fromStop.lineColor,
        stopName: tripData.fromStop.stopName,
        direction: tripData.fromStop.direction,
        directionName: tripData.fromStop.directionName,
      },
      toStop: {
        lineId: tripData.toStop.lineId,
        lineName: tripData.toStop.lineName,
        lineColor: tripData.toStop.lineColor,
        stopName: tripData.toStop.stopName,
        direction: tripData.toStop.direction,
        directionName: tripData.toStop.directionName,
      },
      lastUsed: new Date().toISOString(),
      usageCount: 1,
    };

    // Vérifier si le trajet existe déjà
    const existingIndex = recentTrips.findIndex(
      (trip) => trip.id === newTrip.id
    );
    let updatedTrips;

    if (existingIndex !== -1) {
      // Mettre à jour le trajet existant
      updatedTrips = [...recentTrips];
      updatedTrips[existingIndex] = {
        ...updatedTrips[existingIndex],
        lastUsed: newTrip.lastUsed,
        usageCount: updatedTrips[existingIndex].usageCount + 1,
      };
      // Remettre en première position
      const updatedTrip = updatedTrips.splice(existingIndex, 1)[0];
      updatedTrips.unshift(updatedTrip);
    } else {
      // Ajouter le nouveau trajet en première position
      updatedTrips = [newTrip, ...recentTrips.slice(0, 4)]; // Garder max 5 trajets
    }

    setRecentTrips(updatedTrips);
    saveToStorage(STORAGE_KEYS.RECENT_TRIPS, updatedTrips);

    // Sauvegarder comme dernier trajet
    setLastTrip(newTrip);
    saveToStorage(STORAGE_KEYS.LAST_TRIP, newTrip);
  };

  // Supprimer un trajet des récents
  const removeRecentTrip = (tripId) => {
    const updatedTrips = recentTrips.filter((trip) => trip.id !== tripId);
    setRecentTrips(updatedTrips);
    saveToStorage(STORAGE_KEYS.RECENT_TRIPS, updatedTrips);
  };

  // Créer un trajet rapide (pour enfants : domicile ↔ école)
  const createQuickTrip = (
    homeStop,
    schoolStop,
    label = "Domicile ↔ École"
  ) => {
    const quickTrip = {
      id: `quick-${homeStop.lineId}-${homeStop.stopName}-${schoolStop.lineId}-${schoolStop.stopName}`,
      label,
      homeStop,
      schoolStop,
      createdAt: new Date().toISOString(),
    };

    return quickTrip;
  };

  // Inverser un trajet (retour)
  const reverseTrip = (trip) => {
    return {
      ...trip,
      fromStop: trip.toStop,
      toStop: trip.fromStop,
      id: `${trip.toStop.lineId}-${trip.toStop.stopName}-to-${trip.fromStop.lineId}-${trip.fromStop.stopName}`,
    };
  };

  // Sauvegarder la dernière recherche
  const saveLastSearch = (searchData) => {
    const searchToSave = {
      departure: searchData.departure,
      arrival: searchData.arrival,
      results: searchData.results,
      timestamp: new Date().toISOString(),
    };

    setLastSearch(searchToSave);
    saveToStorage(STORAGE_KEYS.LAST_SEARCH, searchToSave);
  };

  // Effacer la dernière recherche
  const clearLastSearch = () => {
    setLastSearch(null);
    localStorage.removeItem(STORAGE_KEYS.LAST_SEARCH);
  };

  // Effacer toutes les données
  const clearAllData = () => {
    setFavoriteStops([]);
    setRecentTrips([]);
    setLastTrip(null);
    setLastSearch(null);

    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  // Obtenir les arrêts les plus utilisés
  const getMostUsedStops = () => {
    const stopUsage = {};

    recentTrips.forEach((trip) => {
      const fromStopKey = `${trip.fromStop.lineId}-${trip.fromStop.stopName}`;
      const toStopKey = `${trip.toStop.lineId}-${trip.toStop.stopName}`;

      stopUsage[fromStopKey] = (stopUsage[fromStopKey] || 0) + trip.usageCount;
      stopUsage[toStopKey] = (stopUsage[toStopKey] || 0) + trip.usageCount;
    });

    return Object.entries(stopUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([stopKey]) => {
        const [lineId, stopName] = stopKey.split("-");
        return favoriteStops.find(
          (stop) => stop.lineId === lineId && stop.stopName === stopName
        );
      })
      .filter(Boolean);
  };

  return {
    // États
    favoriteStops,
    recentTrips,
    lastTrip,
    lastSearch,

    // Actions pour les arrêts favoris
    addFavoriteStop,
    removeFavoriteStop,
    isFavoriteStop,

    // Actions pour les trajets
    saveTrip,
    removeRecentTrip,
    reverseTrip,
    createQuickTrip,

    // Actions pour les recherches
    saveLastSearch,
    clearLastSearch,

    // Utilitaires
    getMostUsedStops,
    clearAllData,
  };
};

export default useUserPreferences;
