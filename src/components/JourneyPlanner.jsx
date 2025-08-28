import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Autocomplete,
  TextField,
  Button,
  Alert,
  Collapse,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import {
  SwapVert,
  LocationOn,
  Flag,
  Schedule,
  ExpandMore,
  ExpandLess,
  Settings,
  AccessTime,
  CalendarToday,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import "moment/locale/fr";
import JourneyCard from "./JourneyCard";

// Configuration moment en français
moment.locale("fr");

const JourneyPlanner = ({
  busData,
  onJourneyPlan,
  defaultDeparture,
  defaultArrival,
  saveFrequentJourney,
  setDefaultDepartureStop,
  setDefaultArrivalStop,
  lastSearch,
  saveLastSearch,
  clearLastSearch,
}) => {
  const [departure, setDeparture] = useState(null);
  const [arrival, setArrival] = useState(null);
  const [allStops, setAllStops] = useState([]);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [journeyResults, setJourneyResults] = useState(null);

  // Options avancées
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => moment());
  const [selectedTime, setSelectedTime] = useState(() => moment());

  // Initialiser toutes les stations disponibles
  useEffect(() => {
    const stopsSet = new Set();

    busData.lines.forEach((line) => {
      line.routes.forEach((route) => {
        route.stops.forEach((stop) => {
          stopsSet.add(stop.name);
        });
      });
    });

    const stops = Array.from(stopsSet).map((stopName) => {
      // Extraire la ville du nom de l'arrêt
      const city = stopName.split(" - ")[0];
      return {
        name: stopName,
        city: city,
      };
    });

    // Grouper par ville pour l'affichage
    const groupedStops = stops.sort((a, b) => {
      if (a.city !== b.city) {
        return a.city.localeCompare(b.city);
      }
      return a.name.localeCompare(b.name);
    });

    setAllStops(groupedStops);
  }, [busData]);

  // Charger automatiquement la dernière recherche
  useEffect(() => {
    if (lastSearch && allStops.length > 0) {
      // Retrouver les objets départ et arrivée dans allStops
      const departureStop = allStops.find(
        (stop) => stop.name === lastSearch.departure?.name
      );
      const arrivalStop = allStops.find(
        (stop) => stop.name === lastSearch.arrival?.name
      );

      if (departureStop && arrivalStop) {
        setDeparture(departureStop);
        setArrival(arrivalStop);

        // Restaurer les résultats si ils sont encore valides (moins de 30 minutes)
        const searchAge = Date.now() - new Date(lastSearch.timestamp).getTime();
        if (searchAge < 30 * 60 * 1000) {
          // 30 minutes
          setJourneyResults(lastSearch.results);
        }
      }
    }
  }, [lastSearch, allStops]);

  // Charger les valeurs par défaut
  useEffect(() => {
    if (defaultDeparture) {
      const departureStop = allStops.find(
        (stop) => stop.name === defaultDeparture
      );
      if (departureStop) setDeparture(departureStop);
    }
    if (defaultArrival) {
      const arrivalStop = allStops.find((stop) => stop.name === defaultArrival);
      if (arrivalStop) setArrival(arrivalStop);
    }
  }, [defaultDeparture, defaultArrival, allStops]);

  const handleSwapStops = () => {
    const temp = departure;
    setDeparture(arrival);
    setArrival(temp);
  };

  const findDirectRoutes = (departureStop, arrivalStop) => {
    const results = [];

    busData.lines.forEach((line) => {
      line.routes.forEach((route) => {
        const departureIndex = route.stops.findIndex(
          (stop) => stop.name === departureStop
        );
        const arrivalIndex = route.stops.findIndex(
          (stop) => stop.name === arrivalStop
        );

        // Vérifier si les deux arrêts sont sur cette route et dans le bon ordre
        if (
          departureIndex !== -1 &&
          arrivalIndex !== -1 &&
          departureIndex < arrivalIndex
        ) {
          const departureTime = route.stops[departureIndex].time;
          const arrivalTime = route.stops[arrivalIndex].time;

          // Calculer la durée
          const [depHours, depMinutes] = departureTime.split(":").map(Number);
          const [arrHours, arrMinutes] = arrivalTime.split(":").map(Number);
          const duration =
            arrHours * 60 + arrMinutes - (depHours * 60 + depMinutes);

          results.push({
            line: line,
            route: route,
            departureStop: route.stops[departureIndex],
            arrivalStop: route.stops[arrivalIndex],
            duration: duration,
            stops: route.stops.slice(departureIndex, arrivalIndex + 1),
          });
        }
      });
    });

    // Filtrer les trajets passés et trier le reste
    return results
      .filter((result) => {
        const tripDay = getTripDay(result.route, result.departureStop.time);
        // Exclure les trajets passés (aujourd'hui ou date personnalisée)
        return (
          tripDay.day !== "today-passed" && tripDay.day !== "custom-date-passed"
        );
      })
      .sort((a, b) => {
        // Obtenir le statut de chaque trajet (aujourd'hui/demain/autre)
        const aTripDay = getTripDay(a.route, a.departureStop.time);
        const bTripDay = getTripDay(b.route, b.departureStop.time);

        // Priorité de tri : aujourd'hui > demain/custom-date > autre
        const priorityOrder = {
          today: 1,
          tomorrow: 2,
          "custom-date": 2, // Même priorité que demain
          "custom-date-passed": 4, // Après "other" (ne devrait pas apparaître grâce au filtre)
          other: 3,
        };

        const aPriority = priorityOrder[aTripDay.day] || 3;
        const bPriority = priorityOrder[bTripDay.day] || 3;

        // Si différente priorité, trier par priorité
        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }

        // Même priorité, trier par heure de départ
        const [aHours, aMinutes] = a.departureStop.time.split(":").map(Number);
        const [bHours, bMinutes] = b.departureStop.time.split(":").map(Number);
        return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
      });
  };

  const findAlternativeRoutes = (departureStop, arrivalStop) => {
    // Pour les alternatives, on cherche des routes qui passent près des arrêts demandés
    const alternatives = [];
    const departureCity = departureStop.split(" - ")[0];
    const arrivalCity = arrivalStop.split(" - ")[0];

    busData.lines.forEach((line) => {
      line.routes.forEach((route) => {
        const nearDeparture = route.stops.filter(
          (stop) =>
            stop.name.startsWith(departureCity) && stop.name !== departureStop
        );
        const nearArrival = route.stops.filter(
          (stop) =>
            stop.name.startsWith(arrivalCity) && stop.name !== arrivalStop
        );

        if (nearDeparture.length > 0 && nearArrival.length > 0) {
          nearDeparture.forEach((depStop) => {
            nearArrival.forEach((arrStop) => {
              const depIndex = route.stops.findIndex(
                (s) => s.name === depStop.name
              );
              const arrIndex = route.stops.findIndex(
                (s) => s.name === arrStop.name
              );

              if (depIndex !== -1 && arrIndex !== -1 && depIndex < arrIndex) {
                alternatives.push({
                  line: line,
                  route: route,
                  departureStop: depStop,
                  arrivalStop: arrStop,
                  isAlternative: true,
                  stops: route.stops.slice(depIndex, arrIndex + 1),
                });
              }
            });
          });
        }
      });
    });

    // Filtrer les trajets passés et trier le reste
    return alternatives
      .filter((alternative) => {
        const tripDay = getTripDay(
          alternative.route,
          alternative.departureStop.time
        );
        // Exclure les trajets passés aujourd'hui
        return tripDay.day !== "today-passed";
      })
      .sort((a, b) => {
        // Obtenir le statut de chaque trajet (aujourd'hui/demain/autre)
        const aTripDay = getTripDay(a.route, a.departureStop.time);
        const bTripDay = getTripDay(b.route, b.departureStop.time);

        // Priorité de tri : aujourd'hui > demain/custom-date > autre
        const priorityOrder = {
          today: 1,
          tomorrow: 2,
          "custom-date": 2, // Même priorité que demain
          "custom-date-passed": 4, // Après "other" (ne devrait pas apparaître grâce au filtre)
          other: 3,
        };

        const aPriority = priorityOrder[aTripDay.day] || 3;
        const bPriority = priorityOrder[bTripDay.day] || 3;

        // Si différente priorité, trier par priorité
        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }

        // Même priorité, trier par heure de départ
        const [aHours, aMinutes] = a.departureStop.time.split(":").map(Number);
        const [bHours, bMinutes] = b.departureStop.time.split(":").map(Number);
        return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
      });
  };

  const handlePlanJourney = () => {
    if (!departure || !arrival) {
      return;
    }

    const directRoutes = findDirectRoutes(departure.name, arrival.name);
    const alternativeRoutes = findAlternativeRoutes(
      departure.name,
      arrival.name
    );

    const results = {
      departure: departure,
      arrival: arrival,
      directRoutes: directRoutes,
      alternativeRoutes: alternativeRoutes,
    };

    setJourneyResults(results);

    // Sauvegarder la recherche automatiquement
    if (saveLastSearch) {
      saveLastSearch({
        departure: departure,
        arrival: arrival,
        results: results,
      });
    }

    // Sauvegarder comme voyage fréquent et arrêts par défaut
    if (saveFrequentJourney) {
      saveFrequentJourney(departure.name, arrival.name);
    }
    if (setDefaultDepartureStop) {
      setDefaultDepartureStop(departure.name);
    }
    if (setDefaultArrivalStop) {
      setDefaultArrivalStop(arrival.name);
    }

    if (onJourneyPlan) {
      onJourneyPlan(departure.name, arrival.name);
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, "0")}`;
  };

  const isActiveToday = (route) => {
    const today = new Date().getDay();
    const dayMap = {
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
      0: "sunday",
    };
    return route.days.includes(dayMap[today]);
  };

  // Fonction pour détecter si on utilise une date/heure personnalisée
  const isUsingCustomDateTime = () => {
    const now = moment();
    const currentDate = now.format("YYYY-MM-DD");
    const currentTime = now.format("HH:mm");
    const selDate = selectedDate.format("YYYY-MM-DD");
    const selTime = selectedTime.format("HH:mm");

    return selDate !== currentDate || selTime !== currentTime;
  };

  const getTripDay = (route, departureTime) => {
    // Utiliser la date/heure sélectionnée si différente de maintenant
    let referenceDate;
    let currentTimeInMinutes;

    if (isUsingCustomDateTime()) {
      referenceDate = moment(selectedDate)
        .hour(selectedTime.hour())
        .minute(selectedTime.minute());
      currentTimeInMinutes = referenceDate.hour() * 60 + referenceDate.minute();
    } else {
      referenceDate = moment();
      currentTimeInMinutes = referenceDate.hour() * 60 + referenceDate.minute();
    }

    const [depHours, depMinutes] = departureTime.split(":").map(Number);
    const departureTimeInMinutes = depHours * 60 + depMinutes;

    const today = referenceDate.day();
    const tomorrow = (today + 1) % 7;

    const dayMap = {
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
      0: "sunday",
    };

    const todayString = dayMap[today];
    const tomorrowString = dayMap[tomorrow];

    // Si on utilise une date personnalisée
    if (isUsingCustomDateTime()) {
      const now = moment();
      const isToday = referenceDate.isSame(now, "day");
      const isTomorrow = referenceDate.isSame(now.clone().add(1, "day"), "day");

      // Calculer le jour de la semaine pour la date sélectionnée
      const selectedDay = referenceDate.day();
      const selectedDayString = dayMap[selectedDay];

      if (isToday) {
        // Si c'est aujourd'hui, utiliser la logique normale
        if (
          route.days.includes(selectedDayString) &&
          departureTimeInMinutes > currentTimeInMinutes
        ) {
          return { day: "today", label: "🟢 Aujourd'hui", circulates: true };
        } else if (route.days.includes(selectedDayString)) {
          return {
            day: "today-passed",
            label: "⚪ Aujourd'hui (passé)",
            circulates: false,
          };
        }
      } else if (isTomorrow) {
        // Si c'est demain
        if (route.days.includes(selectedDayString)) {
          return { day: "tomorrow", label: "🟡 Demain", circulates: true };
        }
      } else {
        // Pour toute autre date, afficher la date
        if (route.days.includes(selectedDayString)) {
          // Vérifier que l'heure du bus est après l'heure sélectionnée
          if (departureTimeInMinutes >= currentTimeInMinutes) {
            return {
              day: "custom-date",
              label: `📅 ${referenceDate.format("DD/MM/YYYY")}`,
              circulates: true,
            };
          } else {
            return {
              day: "custom-date-passed",
              label: `⚪ ${referenceDate.format("DD/MM/YYYY")} (passé)`,
              circulates: false,
            };
          }
        }
      }

      // Si le bus ne circule pas ce jour-là
      return {
        day: "other",
        label: "⚪ Pas de circulation",
        circulates: false,
      };
    }

    // Logique normale pour la date actuelle
    // Si l'heure est passée et que le bus circule demain
    if (
      departureTimeInMinutes <= currentTimeInMinutes &&
      route.days.includes(tomorrowString)
    ) {
      return { day: "tomorrow", label: "🟡 Demain", circulates: true };
    }

    // Si le bus circule aujourd'hui et l'heure n'est pas passée
    if (
      route.days.includes(todayString) &&
      departureTimeInMinutes > currentTimeInMinutes
    ) {
      return { day: "today", label: "🟢 Aujourd'hui", circulates: true };
    }

    // Si le bus circule aujourd'hui mais l'heure est passée
    if (route.days.includes(todayString)) {
      return {
        day: "today-passed",
        label: "⚪ Aujourd'hui (passé)",
        circulates: false,
      };
    }

    // Si le bus ne circule ni aujourd'hui ni demain
    return { day: "other", label: "⚪ Pas de circulation", circulates: false };
  };

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          mb: { xs: 2, sm: 4 },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
          textAlign="center"
        >
          🗺️ Rechercher un bus
        </Typography>
        <Typography
          variant="subtitle1"
          textAlign="center"
          sx={{ mb: 3, opacity: 0.9 }}
        >
          Trouvez le meilleur itinéraire entre votre point de départ et votre
          destination
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item size={{ xs: 12, sm: 5 }}>
            <Autocomplete
              value={departure}
              onChange={(event, newValue) => setDeparture(newValue)}
              options={allStops}
              groupBy={(option) => option.city}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Départ"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                    },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <LocationOn color="success" />,
                  }}
                />
              )}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 2 }} textAlign="center">
            <IconButton
              onClick={handleSwapStops}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              <SwapVert sx={{ transform: { sm: "rotate(90deg)" } }} />
            </IconButton>
          </Grid>

          <Grid item size={{ xs: 12, sm: 5 }}>
            <Autocomplete
              value={arrival}
              onChange={(event, newValue) => setArrival(newValue)}
              options={allStops}
              groupBy={(option) => option.city}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Arrivée"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                    },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <Flag color="error" />,
                  }}
                />
              )}
            />
          </Grid>

          {/* Options avancées */}
          <Grid item size={{ xs: 12 }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Button
                variant="text"
                size="small"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                startIcon={<Settings />}
                endIcon={showAdvancedOptions ? <ExpandLess /> : <ExpandMore />}
                sx={{
                  color: "text.primary",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                Options avancées
              </Button>
            </Box>

            <Collapse in={showAdvancedOptions}>
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: "grey.50",
                  borderRadius: 2,
                  border: 1,
                  borderColor: "grey.200",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 2 }}
                >
                  Choisissez une date et heure pour planifier votre voyage
                </Typography>

                <LocalizationProvider
                  dateAdapter={AdapterMoment}
                  adapterLocale="fr"
                >
                  <Grid container spacing={2}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <DatePicker
                        label="Date"
                        value={selectedDate}
                        onChange={(newValue) =>
                          setSelectedDate(newValue || moment())
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            InputProps: {
                              startAdornment: (
                                <CalendarToday
                                  sx={{ color: "action.active", mr: 1 }}
                                />
                              ),
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <DesktopTimePicker
                        label="Heure"
                        value={selectedTime}
                        onChange={(newValue) =>
                          setSelectedTime(newValue || moment())
                        }
                        ampm={false}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            InputProps: {
                              startAdornment: (
                                <AccessTime
                                  sx={{ color: "action.active", mr: 1 }}
                                />
                              ),
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </Box>
            </Collapse>
          </Grid>

          <Grid item size={{ xs: 12 }}>
            <Button
              variant="contained"
              onClick={handlePlanJourney}
              disabled={!departure || !arrival}
              fullWidth
              size="large"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontSize: "1.1rem",
                py: 2,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                },
                "&:disabled": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.5)",
                },
              }}
            >
              🚀 Trouver mon bus
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {journeyResults && (
        <Box>
          {/* Routes directes */}
          {journeyResults.directRoutes.length > 0 ? (
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ mb: 2 }}
              >
                🎯 Trajets directs trouvés
              </Typography>
              <Grid container spacing={2}>
                {journeyResults.directRoutes.map((result, index) => (
                  <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <JourneyCard
                      result={result}
                      isAlternative={false}
                      getTripDay={getTripDay}
                      formatDuration={formatDuration}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              Aucun trajet direct trouvé entre ces deux arrêts.
            </Alert>
          )}

          {/* Routes alternatives */}
          {journeyResults.alternativeRoutes.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                onClick={() => setShowAlternatives(!showAlternatives)}
                sx={{ cursor: "pointer" }}
              >
                <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
                  🔄 Trajets alternatifs dans les mêmes villes
                </Typography>
                <IconButton
                  onClick={() => setShowAlternatives(!showAlternatives)}
                  aria-expanded={showAlternatives}
                >
                  {showAlternatives ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>

              <Collapse in={showAlternatives}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {journeyResults.alternativeRoutes
                    .slice(0, 4)
                    .map((result, index) => (
                      <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <JourneyCard
                          result={result}
                          isAlternative={true}
                          getTripDay={getTripDay}
                          formatDuration={formatDuration}
                        />
                      </Grid>
                    ))}
                </Grid>
              </Collapse>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default JourneyPlanner;
