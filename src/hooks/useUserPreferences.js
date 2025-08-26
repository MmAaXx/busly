import { useState, useEffect } from "react";

// Clés pour le localStorage
const STORAGE_KEYS = {
  FAVORITE_STOPS: "bus-hours-favorite-stops",
  RECENT_TRIPS: "bus-hours-recent-trips",
  LAST_TRIP: "bus-hours-last-trip",
  FREQUENT_JOURNEYS: "bus-hours-frequent-journeys",
  DEFAULT_DEPARTURE: "bus-hours-default-departure",
  DEFAULT_ARRIVAL: "bus-hours-default-arrival",
};

const useUserPreferences = () => {
  const [favoriteStops, setFavoriteStops] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [lastTrip, setLastTrip] = useState(null);
  const [frequentJourneys, setFrequentJourneys] = useState([]);
  const [defaultDeparture, setDefaultDeparture] = useState(null);
  const [defaultArrival, setDefaultArrival] = useState(null);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedStops = localStorage.getItem(STORAGE_KEYS.FAVORITE_STOPS);
      const savedTrips = localStorage.getItem(STORAGE_KEYS.RECENT_TRIPS);
      const savedLastTrip = localStorage.getItem(STORAGE_KEYS.LAST_TRIP);
      const savedJourneys = localStorage.getItem(
        STORAGE_KEYS.FREQUENT_JOURNEYS
      );
      const savedDeparture = localStorage.getItem(
        STORAGE_KEYS.DEFAULT_DEPARTURE
      );
      const savedArrival = localStorage.getItem(STORAGE_KEYS.DEFAULT_ARRIVAL);

      if (savedStops) {
        setFavoriteStops(JSON.parse(savedStops));
      }
      if (savedTrips) {
        setRecentTrips(JSON.parse(savedTrips));
      }
      if (savedLastTrip) {
        setLastTrip(JSON.parse(savedLastTrip));
      }
      if (savedJourneys) {
        setFrequentJourneys(JSON.parse(savedJourneys));
      }
      if (savedDeparture) {
        setDefaultDeparture(JSON.parse(savedDeparture));
      }
      if (savedArrival) {
        setDefaultArrival(JSON.parse(savedArrival));
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

  // Effacer toutes les données
  const clearAllData = () => {
    setFavoriteStops([]);
    setRecentTrips([]);
    setLastTrip(null);

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

  // Sauvegarder un trajet fréquent du planificateur
  const saveFrequentJourney = (departure, arrival) => {
    const journeyId = `${departure.name}-to-${arrival.name}`;
    const newJourney = {
      id: journeyId,
      departure: {
        name: departure.name,
        city: departure.city,
        fullName: departure.fullName,
      },
      arrival: {
        name: arrival.name,
        city: arrival.city,
        fullName: arrival.fullName,
      },
      lastUsed: new Date().toISOString(),
      usageCount: 1,
    };

    // Vérifier si le trajet existe déjà
    const existingIndex = frequentJourneys.findIndex(
      (journey) => journey.id === journeyId
    );

    let updatedJourneys;
    if (existingIndex !== -1) {
      // Mettre à jour le trajet existant
      updatedJourneys = [...frequentJourneys];
      updatedJourneys[existingIndex] = {
        ...updatedJourneys[existingIndex],
        lastUsed: newJourney.lastUsed,
        usageCount: updatedJourneys[existingIndex].usageCount + 1,
      };
      // Remettre en première position
      const updatedJourney = updatedJourneys.splice(existingIndex, 1)[0];
      updatedJourneys.unshift(updatedJourney);
    } else {
      // Ajouter le nouveau trajet en première position
      updatedJourneys = [newJourney, ...frequentJourneys.slice(0, 4)]; // Garder max 5 trajets
    }

    setFrequentJourneys(updatedJourneys);
    saveToStorage(STORAGE_KEYS.FREQUENT_JOURNEYS, updatedJourneys);
  };

  // Définir l'arrêt de départ par défaut
  const setDefaultDepartureStop = (departure) => {
    const departureData = {
      name: departure.name,
      city: departure.city,
      fullName: departure.fullName,
      setAt: new Date().toISOString(),
    };
    setDefaultDeparture(departureData);
    saveToStorage(STORAGE_KEYS.DEFAULT_DEPARTURE, departureData);
  };

  // Définir l'arrêt d'arrivée par défaut
  const setDefaultArrivalStop = (arrival) => {
    const arrivalData = {
      name: arrival.name,
      city: arrival.city,
      fullName: arrival.fullName,
      setAt: new Date().toISOString(),
    };
    setDefaultArrival(arrivalData);
    saveToStorage(STORAGE_KEYS.DEFAULT_ARRIVAL, arrivalData);
  };

  // Supprimer un trajet fréquent
  const removeFrequentJourney = (journeyId) => {
    const updatedJourneys = frequentJourneys.filter(
      (journey) => journey.id !== journeyId
    );
    setFrequentJourneys(updatedJourneys);
    saveToStorage(STORAGE_KEYS.FREQUENT_JOURNEYS, updatedJourneys);
  };

  return {
    // États
    favoriteStops,
    recentTrips,
    lastTrip,
    frequentJourneys,
    defaultDeparture,
    defaultArrival,

    // Actions pour les arrêts favoris
    addFavoriteStop,
    removeFavoriteStop,
    isFavoriteStop,

    // Actions pour les trajets
    saveTrip,
    removeRecentTrip,
    reverseTrip,
    createQuickTrip,

    // Actions pour le planificateur
    saveFrequentJourney,
    removeFrequentJourney,
    setDefaultDepartureStop,
    setDefaultArrivalStop,

    // Utilitaires
    getMostUsedStops,
    clearAllData,
  };
};

export default useUserPreferences;
