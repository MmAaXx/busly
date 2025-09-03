import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DirectionsBus, Schedule } from "@mui/icons-material";
import QuickAccess from "./QuickAccess";
import UserGuide from "./UserGuide";
import ShareApp from "./ShareApp";
import JourneyPlanner from "./JourneyPlanner";
import AllBusLines from "./AllBusLines";
import useUserPreferences from "../hooks/useUserPreferences";
import busData from "../data/bus-lines.json";

const BusRoutesView = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Détection responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Hook pour les préférences utilisateur
  const {
    favoriteStops,
    recentTrips,
    lastTrip,
    lastSearch,
    frequentJourneys,
    defaultDeparture,
    defaultArrival,
    addFavoriteStop,
    removeFavoriteStop,
    isFavoriteStop,
    saveTrip,
    removeRecentTrip,
    saveFrequentJourney,
    removeFrequentJourney,
    setDefaultDepartureStop,
    setDefaultArrivalStop,
    saveLastSearch,
    clearLastSearch,
  } = useUserPreferences();

  const handleStopSelect = (lineId, stopName) => {
    console.log("Arrêt sélectionné:", { lineId, stopName });
    saveTrip(lineId, null, stopName);
  };

  const handleTripSelect = (trip) => {
    console.log("Voyage sélectionné depuis QuickAccess:", trip);
  };

  const handleJourneyPlan = (departure, arrival) => {
    console.log("Planification de voyage:", { departure, arrival });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleStopClick = (stopName) => {
    console.log("Arrêt cliqué:", stopName);
    // Ici on pourrait naviguer vers les détails de l'arrêt
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 0 }}>
      <Paper
        elevation={3}
        sx={{
          p: 0,
          marginBottom: 3,
          background: "transparent",
          boxShadow: "none",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered={!isMobile}
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
          sx={{
            mb: 3,
            background: "white",
            borderRadius: "10px",
            "& .MuiTabs-indicator": {
              display: "flex",
              height: "5px",
              justifyContent: "center",
              backgroundColor: "transparent",
            },
            "& .MuiTabs-indicatorSpan": {
              maxWidth: 80,
              borderRadius: "10px",
              height: "5px",
              borderBottom: "1px solid white",
              width: "100%",
              backgroundColor: "primary.main",
            },
          }}
        >
          <Tab label="🗺️ Trouver un bus" />
          <Tab label="🚌 Toutes les lignes de bus" />
        </Tabs>

        {/* Onglet Planificateur de voyage */}
        {selectedTab === 0 && (
          <Box>
            <JourneyPlanner
              busData={busData}
              onJourneyPlan={handleJourneyPlan}
              defaultDeparture={defaultDeparture}
              defaultArrival={defaultArrival}
              saveFrequentJourney={saveFrequentJourney}
              setDefaultDepartureStop={setDefaultDepartureStop}
              setDefaultArrivalStop={setDefaultArrivalStop}
              lastSearch={lastSearch}
              saveLastSearch={saveLastSearch}
              clearLastSearch={clearLastSearch}
            />

            <QuickAccess
              favoriteStops={favoriteStops}
              recentTrips={recentTrips}
              lastTrip={lastTrip}
              frequentJourneys={frequentJourneys}
              onStopSelect={handleStopSelect}
              onTripSelect={handleTripSelect}
              removeFavoriteStop={removeFavoriteStop}
              removeRecentTrip={removeRecentTrip}
              removeFrequentJourney={removeFrequentJourney}
            />

            <UserGuide />

            {/* Section Partage */}
            <ShareApp />
          </Box>
        )}

        {/* Onglet Toutes les courses */}
        {selectedTab === 1 && (
          <AllBusLines busData={busData} onStopClick={handleStopClick} />
        )}
      </Paper>
    </Box>
  );
};

export default BusRoutesView;
