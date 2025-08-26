import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Collapse,
  IconButton,
  Grid,
  Alert,
  Divider,
} from "@mui/material";
import {
  LocationOn,
  ExpandMore,
  ExpandLess,
  AccessTime,
  Schedule,
  HourglassEmpty,
  Star,
  StarBorder,
} from "@mui/icons-material";

const BusStop = ({
  stop,
  currentDay,
  lineColor,
  lineId,
  lineName,
  direction,
  directionName,
  addFavoriteStop,
  removeFavoriteStop,
  isFavoriteStop,
}) => {
  const [nextTimes, setNextTimes] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const findNextTimes = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const schedule = stop.schedule[currentDay] || [];

      const upcoming = schedule
        .map((time) => {
          const [hours, minutes] = time.split(":").map(Number);
          const timeInMinutes = hours * 60 + minutes;
          const minutesUntil = timeInMinutes - currentTime;
          return { time, minutesUntil, timeInMinutes };
        })
        .filter((item) => item.minutesUntil > 0)
        .slice(0, 3);

      setNextTimes(upcoming);
    };

    findNextTimes();
    const interval = setInterval(findNextTimes, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [stop, currentDay]);

  const formatMinutesUntil = (minutes) => {
    if (minutes < 60) {
      return `dans ${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `dans ${hours}h${remainingMinutes.toString().padStart(2, "0")}`;
  };

  const allTimes = stop.schedule[currentDay] || [];

  // Gestion des favoris
  const isFavorite = isFavoriteStop && isFavoriteStop(lineId, stop.name);

  const handleFavoriteToggle = (event) => {
    event.stopPropagation(); // Empêcher l'expansion/collapse

    const stopData = {
      lineId,
      lineName,
      lineColor,
      stopName: stop.name,
      direction,
      directionName,
    };

    if (isFavorite) {
      const stopId = `${lineId}-${stop.name}`;
      removeFavoriteStop && removeFavoriteStop(stopId);
    } else {
      addFavoriteStop && addFavoriteStop(stopData);
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        transition: "all 0.3s ease",
        "&:hover": {
          elevation: 4,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 2,
          "&:last-child": { pb: 2 },
          cursor: "pointer",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              component="h4"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
                fontWeight: 600,
              }}
            >
              <LocationOn sx={{ color: lineColor, fontSize: 20 }} />
              {stop.name}
              {addFavoriteStop && removeFavoriteStop && isFavoriteStop && (
                <IconButton
                  size="small"
                  onClick={handleFavoriteToggle}
                  sx={{
                    ml: 1,
                    color: isFavorite ? "warning.main" : "text.secondary",
                    "&:hover": {
                      color: "warning.main",
                      backgroundColor: "warning.light",
                    },
                  }}
                >
                  {isFavorite ? (
                    <Star fontSize="small" />
                  ) : (
                    <StarBorder fontSize="small" />
                  )}
                </IconButton>
              )}
            </Typography>

            {nextTimes.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {nextTimes.map((item, index) => (
                  <Chip
                    key={index}
                    icon={<AccessTime />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.time}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          ({formatMinutesUntil(item.minutesUntil)})
                        </Typography>
                      </Box>
                    }
                    size="small"
                    sx={{
                      backgroundColor: lineColor,
                      color: "white",
                      "& .MuiChip-icon": {
                        color: "white",
                      },
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Alert
                severity="info"
                icon={<HourglassEmpty />}
                sx={{
                  py: 0,
                  "& .MuiAlert-message": {
                    py: 0.5,
                  },
                }}
              >
                <Typography variant="body2">Plus de bus aujourd'hui</Typography>
              </Alert>
            )}
          </Box>

          <IconButton
            size="small"
            sx={{
              ml: 1,
              transition: "transform 0.3s ease",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <ExpandMore />
          </IconButton>
        </Box>
      </CardContent>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent sx={{ pt: 2, pb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
              fontWeight: 600,
            }}
          >
            <Schedule sx={{ fontSize: 20 }} />
            Tous les horaires du jour
          </Typography>

          <Grid container spacing={1}>
            {allTimes.map((time, index) => {
              const [hours, minutes] = time.split(":").map(Number);
              const timeInMinutes = hours * 60 + minutes;
              const now = new Date();
              const currentTime = now.getHours() * 60 + now.getMinutes();
              const isPassed = timeInMinutes <= currentTime;

              return (
                <Grid item xs="auto" key={index}>
                  <Chip
                    label={time}
                    size="small"
                    variant={isPassed ? "outlined" : "filled"}
                    sx={{
                      backgroundColor: isPassed
                        ? "transparent"
                        : `${lineColor}15`,
                      color: isPassed ? "text.disabled" : lineColor,
                      borderColor: isPassed ? "text.disabled" : lineColor,
                      textDecoration: isPassed ? "line-through" : "none",
                      fontWeight: 500,
                      minWidth: 50,
                      "& .MuiChip-label": {
                        fontFamily: "Courier New, monospace",
                      },
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default BusStop;
