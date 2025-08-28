import { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import {
  Search,
  Today,
  ExpandMore,
  ExpandLess,
  DirectionsBus,
  Schedule,
  LocationOn,
} from "@mui/icons-material";
import BusRoute from "./BusRoute";

const AllBusLines = ({ busData, onStopClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [expandedLines, setExpandedLines] = useState(new Set());
  const [error, setError] = useState(null);

  // Obtenir le jour actuel
  const getCurrentDay = () => {
    const today = new Date().getDay();
    if (today === 0) return "sunday";
    if (today === 6) return "saturday";
    return "weekday";
  };

  const currentDay = getCurrentDay();

  // Mapper les jours pour l'affichage
  const dayLabels = {
    monday: "Lundi",
    tuesday: "Mardi",
    wednesday: "Mercredi",
    thursday: "Jeudi",
    friday: "Vendredi",
    saturday: "Samedi",
    sunday: "Dimanche",
  };

  // Filtrer les routes
  const getFilteredLines = () => {
    return busData.lines
      .map((line) => ({
        ...line,
        routes: line.routes.filter((route) => {
          const matchesSearch =
            searchTerm === "" ||
            route.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.direction.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.stops.some((stop) =>
              stop.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

          const matchesType = filterType === "all" || route.type === filterType;

          return matchesSearch && matchesType;
        }),
      }))
      .filter((line) => line.routes.length > 0);
  };

  const filteredLines = getFilteredLines();

  // Vérification de sécurité pour éviter les erreurs de rendu
  if (!busData || !busData.lines || busData.lines.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Aucune donnée de bus disponible
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Veuillez recharger la page
        </Typography>
      </Paper>
    );
  }

  // Gérer l'expansion des lignes
  const toggleLineExpansion = (lineId) => {
    try {
      const newExpanded = new Set(expandedLines);
      if (newExpanded.has(lineId)) {
        newExpanded.delete(lineId);
      } else {
        newExpanded.add(lineId);
      }
      setExpandedLines(newExpanded);
    } catch (err) {
      console.error("Erreur lors de l'expansion de la ligne:", err);
      setError("Erreur lors de l'expansion de la ligne");
    }
  };

  // Grouper les routes par direction pour une ligne
  const getRoutesByDirection = (routes) => {
    if (!routes || routes.length === 0) {
      return {};
    }

    return routes.reduce((acc, route) => {
      if (!route || !route.direction) {
        return acc;
      }

      const direction = route.direction.split(" → ")[0]; // Prendre la première ville
      if (!acc[direction]) {
        acc[direction] = [];
      }
      acc[direction].push(route);
      return acc;
    }, {});
  };

  // Compter les routes actives aujourd'hui
  const getActiveRoutesToday = (routes) => {
    const todayMapped = {
      weekday: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      saturday: ["saturday"],
      sunday: ["sunday"],
    };

    const todayDays = todayMapped[currentDay];
    return routes.filter((route) =>
      route.days.some((day) => todayDays.includes(day))
    );
  };

  // Affichage des erreurs
  if (error) {
    return (
      <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error" gutterBottom>
          Une erreur s'est produite
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <button onClick={() => setError(null)}>Réessayer</button>
        </Box>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <DirectionsBus color="primary" />
          Toutes les lignes de bus
        </Typography>

        {/* Filtres */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item size={{ xs: 12, md: 6 }}>
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
              placeholder="Numéro de course, arrêt, direction..."
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                label="Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="school">Établissements scolaires</MenuItem>
                <MenuItem value="college">Collèges</MenuItem>
                <MenuItem value="regular">Ligne régulière</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Today color="primary" />
          <Typography variant="body2">
            Aujourd'hui :{" "}
            {currentDay === "weekday"
              ? "Jour de semaine"
              : currentDay === "saturday"
              ? "Samedi"
              : "Dimanche"}
          </Typography>
        </Box>
      </Paper>

      {/* Affichage des lignes */}
      {filteredLines.map((line) => {
        const isExpanded = expandedLines.has(line.id);
        const activeRoutes = getActiveRoutesToday(line.routes);
        const routesByDirection = getRoutesByDirection(line.routes);

        return (
          <Card key={line.id} sx={{ mb: 2, overflow: "visible" }}>
            <CardContent sx={{ pb: 1 }}>
              {/* En-tête de ligne */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ cursor: "pointer" }}
                onClick={() => toggleLineExpansion(line.id)}
              >
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item size={12}>
                    <Chip
                      size="small"
                      label={line.name}
                      variant="outlined"
                      sx={{
                        borderColor: line.color,
                        color: "white",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        backgroundColor: `${line.color}`,
                      }}
                    />
                  </Grid>
                  <Grid item size={12}>
                    <Typography variant="body2" color="text.secondary">
                      {line.description}
                    </Typography>
                  </Grid>
                  <Grid item size="auto">
                    <Chip
                      size="small"
                      label={`${line.routes.length} courses`}
                      color="primary"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item size="auto">
                    <Chip
                      size="small"
                      label={`${activeRoutes.length} aujourd'hui`}
                      color={activeRoutes.length > 0 ? "success" : "default"}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item size="grow" textAlign="right">
                    <IconButton>
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>

              {/* Contenu développé - Solution personnalisée sans Collapse */}
              {isExpanded && (
                <Box
                  sx={{
                    mt: 2,
                    animation: isExpanded
                      ? "slideDown 0.3s ease-out"
                      : "slideUp 0.3s ease-out",
                    "@keyframes slideDown": {
                      from: {
                        opacity: 0,
                        maxHeight: 0,
                        overflow: "hidden",
                      },
                      to: {
                        opacity: 1,
                        maxHeight: "1000px",
                        overflow: "visible",
                      },
                    },
                    "@keyframes slideUp": {
                      from: {
                        opacity: 1,
                        maxHeight: "1000px",
                        overflow: "visible",
                      },
                      to: {
                        opacity: 0,
                        maxHeight: 0,
                        overflow: "hidden",
                      },
                    },
                  }}
                >
                  <Divider sx={{ mb: 2 }} />

                  {/* Informations de la ligne */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Opérateur : {line.operator}
                    </Typography>

                    {/* Jours de circulation */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Jours de circulation :
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {[
                          "monday",
                          "tuesday",
                          "wednesday",
                          "thursday",
                          "friday",
                          "saturday",
                          "sunday",
                        ].map((day) => {
                          const hasRoutes = line.routes.some((route) =>
                            route.days.includes(day)
                          );
                          const isToday =
                            (currentDay === "weekday" &&
                              [
                                "monday",
                                "tuesday",
                                "wednesday",
                                "thursday",
                                "friday",
                              ].includes(day)) ||
                            currentDay === day;

                          return (
                            <Chip
                              key={day}
                              size="small"
                              label={dayLabels[day]}
                              color={
                                isToday && hasRoutes ? "primary" : "default"
                              }
                              variant={hasRoutes ? "filled" : "outlined"}
                              sx={{
                                opacity: hasRoutes ? 1 : 0.5,
                                fontSize: "0.75rem",
                              }}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  </Box>

                  {/* Routes par direction */}
                  {Object.entries(routesByDirection).map(
                    ([direction, routes]) => (
                      <Box key={direction} sx={{ mb: 3 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          color="primary"
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LocationOn fontSize="small" />
                          Direction {direction}
                        </Typography>
                        <Grid container spacing={2}>
                          {routes.map((route) => {
                            const isActiveToday =
                              getActiveRoutesToday([route]).length > 0;
                            return (
                              <Grid
                                item
                                size={{ xs: 12, sm: 6, lg: 4 }}
                                key={route.id}
                              >
                                <Box sx={{ opacity: isActiveToday ? 1 : 0.6 }}>
                                  <BusRoute
                                    route={route}
                                    onStopClick={onStopClick}
                                  />
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    )
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        );
      })}

      {filteredLines.length === 0 && (
        <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucune ligne trouvée
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Essayez de modifier vos critères de recherche
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AllBusLines;
