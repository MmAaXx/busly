import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Chip,
  Alert,
  Fade,
  Slide,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  Schedule,
  DirectionsBus,
  NearMe,
  AccessTime,
} from "@mui/icons-material";
import BusStop from "./BusStop";

const BusLine = ({
  line,
  currentDay,
  initialDirection,
  onBack,
  addFavoriteStop,
  removeFavoriteStop,
  isFavoriteStop,
  saveTrip,
}) => {
  const [selectedDirection, setSelectedDirection] = useState(
    initialDirection || "direction1"
  );
  const [nextBuses, setNextBuses] = useState([]);

  const currentDirection = line[selectedDirection];

  useEffect(() => {
    const findNextBuses = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const upcoming = [];

      currentDirection.stops.forEach((stop) => {
        const schedule = stop.schedule[currentDay] || [];

        const nextTimes = schedule
          .map((time) => {
            const [hours, minutes] = time.split(":").map(Number);
            const timeInMinutes = hours * 60 + minutes;
            const minutesUntil = timeInMinutes - currentTime;
            return { time, timeInMinutes, stop: stop.name, minutesUntil };
          })
          .filter((item) => item.timeInMinutes > currentTime)
          .slice(0, 3);

        upcoming.push(...nextTimes);
      });

      upcoming.sort((a, b) => a.timeInMinutes - b.timeInMinutes);
      setNextBuses(upcoming.slice(0, 5));
    };

    findNextBuses();
    const interval = setInterval(findNextBuses, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currentDirection, currentDay]);

  const handleDirectionChange = (event, newDirection) => {
    if (newDirection !== null) {
      setSelectedDirection(newDirection);
    }
  };

  const formatMinutesUntil = (minutes) => {
    if (minutes < 60) {
      return `dans ${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `dans ${hours}h${remainingMinutes.toString().padStart(2, "0")}`;
  };

  return (
    <Fade in timeout={300}>
      <Box>
        <Paper
          elevation={4}
          sx={{
            p: 3,
            mb: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={onBack}
              sx={{
                mr: 2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Retour
            </Button>
            <DirectionsBus
              sx={{
                color: line.color,
                fontSize: 32,
                mr: 1,
              }}
            />
            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: line.color,
                fontWeight: 600,
                flexGrow: 1,
              }}
            >
              {line.name}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <ToggleButtonGroup
              value={selectedDirection}
              exclusive
              onChange={handleDirectionChange}
              sx={{
                "& .MuiToggleButton-root": {
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  border: `2px solid ${line.color}20`,
                  "&.Mui-selected": {
                    backgroundColor: line.color,
                    color: "white",
                    "&:hover": {
                      backgroundColor: line.color,
                      filter: "brightness(0.9)",
                    },
                  },
                },
              }}
            >
              <ToggleButton value="direction1">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <NearMe fontSize="small" />
                  {line.direction1.name}
                </Box>
              </ToggleButton>
              <ToggleButton value="direction2">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <NearMe
                    fontSize="small"
                    sx={{ transform: "rotate(180deg)" }}
                  />
                  {line.direction2.name}
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {nextBuses.length > 0 && (
            <Slide direction="up" in timeout={500}>
              <Alert
                severity="success"
                icon={<Schedule />}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  "& .MuiAlert-message": {
                    width: "100%",
                  },
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Prochains départs
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  {nextBuses.map((bus, index) => (
                    <Chip
                      key={index}
                      icon={<AccessTime />}
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            py: 0.5,
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {bus.time}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {bus.stop} • {formatMinutesUntil(bus.minutesUntil)}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        backgroundColor: line.color,
                        color: "white",
                        "& .MuiChip-icon": {
                          color: "white",
                        },
                        height: "auto",
                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                  ))}
                </Box>
              </Alert>
            </Slide>
          )}
        </Paper>

        <Paper
          elevation={4}
          sx={{
            p: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
              fontWeight: 600,
            }}
          >
            <DirectionsBus sx={{ color: line.color }} />
            Arrêts et horaires
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {currentDirection.stops.map((stop, index) => (
              <Box key={index}>
                <BusStop
                  stop={stop}
                  currentDay={currentDay}
                  lineColor={line.color}
                  lineId={line.id}
                  lineName={line.name}
                  direction={selectedDirection}
                  directionName={currentDirection.name}
                  addFavoriteStop={addFavoriteStop}
                  removeFavoriteStop={removeFavoriteStop}
                  isFavoriteStop={isFavoriteStop}
                />
                {index < currentDirection.stops.length - 1 && (
                  <Divider sx={{ my: 1, opacity: 0.3 }} />
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default BusLine;
