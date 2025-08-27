import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  AccessTime,
  LocationOn,
  DirectionsBus,
  School,
  DateRange,
  Flag,
} from "@mui/icons-material";

const BusRoute = ({ route, onStopClick }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getDayLabel = (days) => {
    if (days.includes("wednesday") && days.length === 1) {
      return "Mercredi uniquement";
    }
    if (
      days.includes("monday") &&
      days.includes("friday") &&
      days.length === 5
    ) {
      return "Lundi → Vendredi";
    }
    if (days.length === 4 && !days.includes("wednesday")) {
      return "Lun, Mar, Jeu, Ven";
    }
    return days
      .map((day) => {
        const dayMap = {
          monday: "Lun",
          tuesday: "Mar",
          wednesday: "Mer",
          thursday: "Jeu",
          friday: "Ven",
          saturday: "Sam",
          sunday: "Dim",
        };
        return dayMap[day];
      })
      .join(", ");
  };

  const getTypeIcon = (type) => {
    return type === "college" ? <School /> : <DirectionsBus />;
  };

  const getTypeColor = (type) => {
    return type === "college" ? "secondary" : "primary";
  };

  const isRouteActiveToday = (days) => {
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
    return days.includes(dayMap[today]);
  };

  const getNextStop = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    if (!isRouteActiveToday(route.days)) {
      return null;
    }

    for (const stop of route.stops) {
      const [hours, minutes] = stop.time.split(":").map(Number);
      const stopTime = hours * 60 + minutes;

      if (stopTime > currentTime) {
        return {
          ...stop,
          minutesUntil: stopTime - currentTime,
        };
      }
    }
    return null;
  };

  const nextStop = getNextStop();

  return (
    <Card
      sx={{
        mb: 2,
        border: isRouteActiveToday(route.days) ? 2 : 1,
        borderColor: isRouteActiveToday(route.days)
          ? "primary.main"
          : "divider",
        backgroundColor: isRouteActiveToday(route.days)
          ? "primary.light"
          : "background.paper",
        opacity: isRouteActiveToday(route.days) ? 1 : 0.7,
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {getTypeIcon(route.type)}
            <Typography variant="h6" component="div">
              Ligne {route.number}
            </Typography>
            <Chip
              label={route.type === "college" ? "Collège" : "École"}
              size="small"
              color={getTypeColor(route.type)}
            />
          </Box>
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {route.description}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <DateRange fontSize="small" />
          <Typography variant="body2">{getDayLabel(route.days)}</Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Direction: {route.direction}
        </Typography>

        {/* Horaires de départ et d'arrivée */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            backgroundColor: "grey.50",
            p: 1.5,
            borderRadius: 1,
            mt: 2,
            ...(nextStop && { mb: 1 }),
            border: 1,
            borderColor: "grey.200",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <LocationOn fontSize="small" color="success" />
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {route.stops[0]?.time}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Départ
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              {(() => {
                const [depHours, depMinutes] = route.stops[0]?.time
                  .split(":")
                  .map(Number) || [0, 0];
                const [arrHours, arrMinutes] = route.stops[
                  route.stops.length - 1
                ]?.time
                  .split(":")
                  .map(Number) || [0, 0];
                const duration =
                  arrHours * 60 + arrMinutes - (depHours * 60 + depMinutes);
                return `${duration} min`;
              })()}
            </Typography>
            <DirectionsBus fontSize="small" />
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Box textAlign="right">
              <Typography variant="body2" fontWeight="bold">
                {route.stops[route.stops.length - 1]?.time}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Arrivée
              </Typography>
            </Box>
            <Flag fontSize="small" color="error" />
          </Box>
        </Box>

        {nextStop && (
          <Box
            sx={{
              backgroundColor: "success.light",
              p: 1,
              borderRadius: 1,
              mb: 0,
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              🚌 Prochain arrêt: {nextStop.name}
            </Typography>
            <Typography variant="body2">
              ⏱️ À {nextStop.time} (dans {nextStop.minutesUntil} min)
            </Typography>
          </Box>
        )}

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Arrêts et horaires:
          </Typography>
          <List dense>
            {route.stops.map((stop, index) => (
              <ListItem
                key={index}
                button
                onClick={() => onStopClick && onStopClick(stop.name)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <LocationOn
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <ListItemText
                  primary={stop.name}
                  secondary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTime fontSize="small" />
                      <Typography variant="body2" component="span">
                        {stop.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default BusRoute;
