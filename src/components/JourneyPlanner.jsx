import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Autocomplete,
  TextField,
  Button,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  SwapVert,
  LocationOn,
  Flag,
  Schedule,
  DirectionsBus,
  ExpandMore,
  ExpandLess,
  AccessTime,
} from "@mui/icons-material";
import busData from "../data/bus-lines.json";

const JourneyPlanner = ({
  onJourneyPlan,
  currentDay,
  defaultDeparture,
  defaultArrival,
  saveFrequentJourney,
  setDefaultDepartureStop,
  setDefaultArrivalStop,
}) => {
  const [departure, setDeparture] = useState(null);
  const [arrival, setArrival] = useState(null);
  const [allStops, setAllStops] = useState([]);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [journeyResults, setJourneyResults] = useState(null);

  // Initialiser toutes les stations disponibles
  useEffect(() => {
    const stops = [];

    busData.lines.forEach((line) => {
      // Direction 1
      line.direction1.stops.forEach((stop) => {
        const existingStop = stops.find((s) => s.name === stop.name);
        if (!existingStop) {
          stops.push({
            name: stop.name,
            city: stop.name.split(" - ")[0],
            fullName: stop.name,
            lines: [
              {
                lineId: line.id,
                lineName: line.name,
                direction: "direction1",
                directionName: line.direction1.name,
                schedule: stop.schedule,
              },
            ],
          });
        } else {
          existingStop.lines.push({
            lineId: line.id,
            lineName: line.name,
            direction: "direction1",
            directionName: line.direction1.name,
            schedule: stop.schedule,
          });
        }
      });

      // Direction 2
      line.direction2.stops.forEach((stop) => {
        const existingStop = stops.find((s) => s.name === stop.name);
        if (!existingStop) {
          stops.push({
            name: stop.name,
            city: stop.name.split(" - ")[0],
            fullName: stop.name,
            lines: [
              {
                lineId: line.id,
                lineName: line.name,
                direction: "direction2",
                directionName: line.direction2.name,
                schedule: stop.schedule,
              },
            ],
          });
        } else {
          existingStop.lines.push({
            lineId: line.id,
            lineName: line.name,
            direction: "direction2",
            directionName: line.direction2.name,
            schedule: stop.schedule,
          });
        }
      });
    });

    setAllStops(stops.sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  // Charger les valeurs par défaut
  useEffect(() => {
    if (defaultDeparture && allStops.length > 0) {
      const defaultDep = allStops.find(
        (stop) => stop.name === defaultDeparture.name
      );
      if (defaultDep) {
        setDeparture(defaultDep);
      }
    }
    if (defaultArrival && allStops.length > 0) {
      const defaultArr = allStops.find(
        (stop) => stop.name === defaultArrival.name
      );
      if (defaultArr) {
        setArrival(defaultArr);
      }
    }
  }, [defaultDeparture, defaultArrival, allStops]);

  const handleSwapStops = () => {
    const temp = departure;
    setDeparture(arrival);
    setArrival(temp);
  };

  // Fonction helper pour obtenir tous les horaires (incluant mercredi si applicable)
  const getAllScheduleTimes = (schedule, currentDay) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = dimanche, 1 = lundi, ..., 3 = mercredi

    let times = schedule[currentDay] || [];

    // Si c'est mercredi (jour 3) et qu'il y a des horaires spéciaux mercredi
    if (dayOfWeek === 3 && schedule.wednesday) {
      times = [...times, ...schedule.wednesday];
    }

    // Trier les horaires par ordre chronologique et supprimer les doublons
    return [...new Set(times)].sort((a, b) => {
      const timeA = a.split(":").map(Number);
      const timeB = b.split(":").map(Number);
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    });
  };

  const findDirectJourney = () => {
    if (!departure || !arrival) return null;

    const results = {
      direct: [],
      alternatives: [],
    };

    // Recherche de trajets directs
    departure.lines.forEach((depLine) => {
      arrival.lines.forEach((arrLine) => {
        if (
          depLine.lineId === arrLine.lineId &&
          depLine.direction === arrLine.direction
        ) {
          // Même ligne et même direction = trajet direct possible
          const line = busData.lines.find((l) => l.id === depLine.lineId);
          const direction = line[depLine.direction];

          const depStopIndex = direction.stops.findIndex(
            (s) => s.name === departure.name
          );
          const arrStopIndex = direction.stops.findIndex(
            (s) => s.name === arrival.name
          );

          if (
            depStopIndex !== -1 &&
            arrStopIndex !== -1 &&
            depStopIndex < arrStopIndex
          ) {
            // Le trajet est valide (départ avant arrivée)
            results.direct.push({
              line: line,
              direction: depLine.direction,
              directionName: depLine.directionName,
              departureStop: direction.stops[depStopIndex],
              arrivalStop: direction.stops[arrStopIndex],
              departureSchedule: getAllScheduleTimes(
                depLine.schedule,
                currentDay
              ),
              arrivalSchedule: getAllScheduleTimes(
                arrLine.schedule,
                currentDay
              ),
            });
          }
        }
      });
    });

    // Recherche d'alternatives proches
    const departureCities = getNearbyCities(departure.city);
    const arrivalCities = getNearbyCities(arrival.city);

    allStops.forEach((depStop) => {
      if (
        departureCities.includes(depStop.city) &&
        depStop.name !== departure.name
      ) {
        allStops.forEach((arrStop) => {
          if (
            arrivalCities.includes(arrStop.city) &&
            arrStop.name !== arrival.name
          ) {
            depStop.lines.forEach((depLine) => {
              arrStop.lines.forEach((arrLine) => {
                if (
                  depLine.lineId === arrLine.lineId &&
                  depLine.direction === arrLine.direction
                ) {
                  const line = busData.lines.find(
                    (l) => l.id === depLine.lineId
                  );
                  const direction = line[depLine.direction];

                  const depStopIndex = direction.stops.findIndex(
                    (s) => s.name === depStop.name
                  );
                  const arrStopIndex = direction.stops.findIndex(
                    (s) => s.name === arrStop.name
                  );

                  if (
                    depStopIndex !== -1 &&
                    arrStopIndex !== -1 &&
                    depStopIndex < arrStopIndex
                  ) {
                    results.alternatives.push({
                      line: line,
                      direction: depLine.direction,
                      directionName: depLine.directionName,
                      departureStop: direction.stops[depStopIndex],
                      arrivalStop: direction.stops[arrStopIndex],
                      departureSchedule: getAllScheduleTimes(
                        depLine.schedule,
                        currentDay
                      ),
                      arrivalSchedule: getAllScheduleTimes(
                        arrLine.schedule,
                        currentDay
                      ),
                    });
                  }
                }
              });
            });
          }
        });
      }
    });

    // Supprimer les doublons des alternatives
    results.alternatives = results.alternatives.filter(
      (alt, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.departureStop.name === alt.departureStop.name &&
            t.arrivalStop.name === alt.arrivalStop.name &&
            t.direction === alt.direction
        )
    );

    return results;
  };

  const getNearbyCities = (city) => {
    // Retourne les villes proches - à adapter selon votre géographie
    const cityGroups = {
      Orchies: ["Orchies"],
      Bouvignies: ["Bouvignies"],
      Coutches: ["Coutches"],
      Douai: ["Douai", "Waziers"],
      Raches: ["Raches"],
      "Flines-lez-Raches": ["Flines-lez-Raches"],
      "Beuvry-la-Forêt": ["Beuvry-la-Forêt"],
      Waziers: ["Douai", "Waziers"],
    };

    return cityGroups[city] || [city];
  };

  const handlePlanJourney = () => {
    const results = findDirectJourney();
    setJourneyResults(results);

    // Sauvegarder ce trajet comme fréquent
    if (saveFrequentJourney && departure && arrival) {
      saveFrequentJourney(departure, arrival);
    }

    // Optionnellement définir comme valeurs par défaut
    if (setDefaultDepartureStop && departure) {
      setDefaultDepartureStop(departure);
    }
    if (setDefaultArrivalStop && arrival) {
      setDefaultArrivalStop(arrival);
    }

    if (onJourneyPlan) {
      onJourneyPlan(departure, arrival, results);
    }
  };

  const formatTime = (time) => {
    return time.replace(":", "h");
  };

  const calculateJourneyTime = (depTimes, arrTimes) => {
    if (!depTimes.length || !arrTimes.length) return null;

    // Trouver les correspondances possibles
    const journeys = [];
    depTimes.forEach((depTime) => {
      arrTimes.forEach((arrTime) => {
        const depMinutes =
          parseInt(depTime.split(":")[0]) * 60 +
          parseInt(depTime.split(":")[1]);
        const arrMinutes =
          parseInt(arrTime.split(":")[0]) * 60 +
          parseInt(arrTime.split(":")[1]);

        if (arrMinutes > depMinutes) {
          journeys.push({
            departure: depTime,
            arrival: arrTime,
            duration: arrMinutes - depMinutes,
          });
        }
      });
    });

    return journeys.sort((a, b) => a.duration - b.duration);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Paper
        elevation={6}
        sx={{
          p: 3,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
          <DirectionsBus sx={{ color: "primary.main", fontSize: 28 }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Planificateur de trajet
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item size={{ xs: 12, md: 5 }}>
            <Autocomplete
              value={departure}
              onChange={(event, newValue) => setDeparture(newValue)}
              options={allStops}
              getOptionLabel={(option) => option.name}
              groupBy={(option) => option.city}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Point de départ"
                  placeholder="Ex: Bouvignies - Place"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <LocationOn sx={{ color: "success.main", mr: 1 }} />
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.lines.length} ligne
                      {option.lines.length > 1 ? "s" : ""} disponible
                      {option.lines.length > 1 ? "s" : ""}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </Grid>

          <Grid item size={{ xs: 12, md: 2 }} sx={{ textAlign: "center" }}>
            <IconButton
              onClick={handleSwapStops}
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": { backgroundColor: "primary.dark" },
              }}
            >
              <SwapVert />
            </IconButton>
          </Grid>

          <Grid item size={{ xs: 12, md: 5 }}>
            <Autocomplete
              value={arrival}
              onChange={(event, newValue) => setArrival(newValue)}
              options={allStops}
              getOptionLabel={(option) => option.name}
              groupBy={(option) => option.city}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Point d'arrivée"
                  placeholder="Ex: Orchies - Collège du Pévèle"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <Flag sx={{ color: "error.main", mr: 1 }} />
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.lines.length} ligne
                      {option.lines.length > 1 ? "s" : ""} disponible
                      {option.lines.length > 1 ? "s" : ""}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            onClick={handlePlanJourney}
            disabled={!departure || !arrival}
            startIcon={<Schedule />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
            }}
          >
            Rechercher les horaires
          </Button>
        </Box>

        {/* Résultats du trajet */}
        {journeyResults && (
          <Box sx={{ mt: 4 }}>
            {journeyResults.direct.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: "success.main", fontWeight: 600 }}
                >
                  🎯 Trajet direct trouvé
                </Typography>
                {journeyResults.direct.map((journey, index) => {
                  const journeyTimes = calculateJourneyTime(
                    journey.departureSchedule,
                    journey.arrivalSchedule
                  );
                  return (
                    <Card
                      key={index}
                      sx={{
                        mb: 2,
                        border: "2px solid",
                        borderColor: "success.light",
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 2,
                            gap: 1,
                          }}
                        >
                          <Chip
                            label={journey.line.name}
                            sx={{
                              backgroundColor: journey.line.color,
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {journey.directionName}
                          </Typography>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <LocationOn
                                sx={{ color: "success.main", fontSize: 20 }}
                              />
                              <Box>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {journey.departureStop.name}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                    mt: 0.5,
                                  }}
                                >
                                  {journey.departureSchedule.map(
                                    (time, idx) => (
                                      <Chip
                                        key={idx}
                                        label={formatTime(time)}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: "0.75rem" }}
                                      />
                                    )
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid item xs={6}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Flag
                                sx={{ color: "error.main", fontSize: 20 }}
                              />
                              <Box>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {journey.arrivalStop.name}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                    mt: 0.5,
                                  }}
                                >
                                  {journey.arrivalSchedule.map((time, idx) => (
                                    <Chip
                                      key={idx}
                                      label={formatTime(time)}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontSize: "0.75rem" }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>

                        {journeyTimes && journeyTimes.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              💡 Correspondances suggérées :
                            </Typography>
                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
                              {journeyTimes.slice(0, 3).map((jt, idx) => (
                                <Chip
                                  key={idx}
                                  icon={<AccessTime />}
                                  label={`${formatTime(
                                    jt.departure
                                  )} → ${formatTime(jt.arrival)} (${
                                    jt.duration
                                  }min)`}
                                  variant="outlined"
                                  size="small"
                                  sx={{ backgroundColor: "success.50" }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}

            {journeyResults.alternatives.length > 0 && (
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "info.main", fontWeight: 600 }}
                  >
                    🔄 Options alternatives
                  </Typography>
                  <IconButton
                    onClick={() => setShowAlternatives(!showAlternatives)}
                    sx={{ ml: 1 }}
                  >
                    {showAlternatives ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>

                <Collapse in={showAlternatives}>
                  {journeyResults.alternatives
                    .slice(0, 3)
                    .map((journey, index) => {
                      const journeyTimes = calculateJourneyTime(
                        journey.departureSchedule,
                        journey.arrivalSchedule
                      );
                      return (
                        <Card
                          key={index}
                          sx={{
                            mb: 2,
                            border: "1px solid",
                            borderColor: "info.light",
                          }}
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                                gap: 1,
                              }}
                            >
                              <Chip
                                label={journey.line.name}
                                sx={{
                                  backgroundColor: journey.line.color,
                                  color: "white",
                                  fontWeight: 600,
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {journey.directionName}
                              </Typography>
                            </Box>

                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <LocationOn
                                    sx={{ color: "info.main", fontSize: 20 }}
                                  />
                                  <Box>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 500 }}
                                    >
                                      {journey.departureStop.name}
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                        mt: 0.5,
                                      }}
                                    >
                                      {journey.departureSchedule
                                        .slice(0, 4)
                                        .map((time, idx) => (
                                          <Chip
                                            key={idx}
                                            label={formatTime(time)}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: "0.75rem" }}
                                          />
                                        ))}
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>

                              <Grid item xs={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Flag
                                    sx={{ color: "warning.main", fontSize: 20 }}
                                  />
                                  <Box>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 500 }}
                                    >
                                      {journey.arrivalStop.name}
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                        mt: 0.5,
                                      }}
                                    >
                                      {journey.arrivalSchedule
                                        .slice(0, 4)
                                        .map((time, idx) => (
                                          <Chip
                                            key={idx}
                                            label={formatTime(time)}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: "0.75rem" }}
                                          />
                                        ))}
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      );
                    })}
                </Collapse>
              </Box>
            )}

            {journeyResults.direct.length === 0 &&
              journeyResults.alternatives.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Aucun trajet direct trouvé entre ces deux arrêts. Essayez de
                  sélectionner des arrêts différents ou consultez les lignes
                  disponibles.
                </Alert>
              )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default JourneyPlanner;
