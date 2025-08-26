import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Chip,
  Paper,
  Fade,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  DirectionsBus,
  Today,
  Search,
  FilterList,
  Schedule,
} from "@mui/icons-material";
import BusRoute from "./BusRoute";
import QuickAccess from "./QuickAccess";
import UserGuide from "./UserGuide";
import JourneyPlannerNew from "./JourneyPlannerNew";
import useUserPreferences from "../hooks/useUserPreferences";
import busData from "../data/bus-lines.json";

const BusRoutesView = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDirection, setFilterDirection] = useState("all");
  const [currentDay, setCurrentDay] = useState("");

  // Hook pour les préférences utilisateur
  const {
    favoriteStops,
    recentTrips,
    lastTrip,
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
  } = useUserPreferences();

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    if (dayOfWeek === 0) {
      setCurrentDay("sunday");
    } else if (dayOfWeek === 6) {
      setCurrentDay("saturday");
    } else {
      setCurrentDay("weekday");
    }
  }, []);

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

  // Filtrer les routes selon les critères
  const getFilteredRoutes = () => {
    const line = busData.lines[0]; // Pour l'instant on n'a qu'une ligne
    if (!line) return [];

    let filteredRoutes = line.routes;

    // Filtre par terme de recherche
    if (searchTerm) {
      filteredRoutes = filteredRoutes.filter(
        (route) =>
          route.number.includes(searchTerm) ||
          route.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.stops.some((stop) =>
            stop.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filtre par type
    if (filterType !== "all") {
      filteredRoutes = filteredRoutes.filter(
        (route) => route.type === filterType
      );
    }

    // Filtre par direction
    if (filterDirection !== "all") {
      filteredRoutes = filteredRoutes.filter((route) =>
        route.direction.includes(filterDirection)
      );
    }

    return filteredRoutes;
  };

  // Grouper les routes par direction
  const getRoutesByDirection = () => {
    const filteredRoutes = getFilteredRoutes();
    const grouped = {
      "Orchies → Douai": [],
      "Douai → Orchies": [],
    };

    filteredRoutes.forEach((route) => {
      if (route.direction.includes("Orchies → Douai")) {
        grouped["Orchies → Douai"].push(route);
      } else if (route.direction.includes("Douai → Orchies")) {
        grouped["Douai → Orchies"].push(route);
      }
    });

    return grouped;
  };

  const routesByDirection = getRoutesByDirection();
  const line = busData.lines[0];

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
          <DirectionsBus color="primary" fontSize="large" />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Busly - Horaires de Bus
          </Typography>
        </Box>

        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Toutes les courses" />
          <Tab label="Planificateur de voyage" />
          <Tab label="Accès rapide" />
        </Tabs>

        {/* Onglet Toutes les courses */}
        {selectedTab === 0 && (
          <Fade in={selectedTab === 0}>
            <Box>
              <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {line?.name} - {line?.description}
                </Typography>

                {/* Filtres */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Rechercher"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Numéro de course, arrêt..."
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={filterType}
                        label="Type"
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <MenuItem value="all">Tous</MenuItem>
                        <MenuItem value="school">
                          Établissements scolaires
                        </MenuItem>
                        <MenuItem value="college">Collèges</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Direction</InputLabel>
                      <Select
                        value={filterDirection}
                        label="Direction"
                        onChange={(e) => setFilterDirection(e.target.value)}
                      >
                        <MenuItem value="all">Toutes</MenuItem>
                        <MenuItem value="Orchies">Orchies → Douai</MenuItem>
                        <MenuItem value="Douai">Douai → Orchies</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Today color="primary" />
                  <Typography variant="body2">
                    Aujourd'hui:{" "}
                    {currentDay === "weekday"
                      ? "Jour de semaine"
                      : currentDay === "saturday"
                      ? "Samedi"
                      : "Dimanche"}
                  </Typography>
                </Box>
              </Paper>

              {/* Affichage des routes par direction */}
              {Object.entries(routesByDirection).map(
                ([direction, routes]) =>
                  routes.length > 0 && (
                    <Paper key={direction} elevation={1} sx={{ p: 2, mb: 3 }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        {direction}
                      </Typography>
                      <Grid container spacing={2}>
                        {routes.map((route) => (
                          <Grid item xs={12} md={6} lg={4} key={route.id}>
                            <BusRoute
                              route={route}
                              onStopClick={handleStopClick}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  )
              )}
            </Box>
          </Fade>
        )}

        {/* Onglet Planificateur de voyage */}
        {selectedTab === 1 && (
          <Fade in={selectedTab === 1}>
            <Box>
              <JourneyPlannerNew
                busData={busData}
                onJourneyPlan={handleJourneyPlan}
                defaultDeparture={defaultDeparture}
                defaultArrival={defaultArrival}
                saveFrequentJourney={saveFrequentJourney}
                setDefaultDepartureStop={setDefaultDepartureStop}
                setDefaultArrivalStop={setDefaultArrivalStop}
              />
            </Box>
          </Fade>
        )}

        {/* Onglet Accès rapide */}
        {selectedTab === 2 && (
          <Fade in={selectedTab === 2}>
            <Box>
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
            </Box>
          </Fade>
        )}
      </Paper>
    </Box>
  );
};

export default BusRoutesView;
