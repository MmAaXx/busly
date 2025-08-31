import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import { DirectionsBus } from "@mui/icons-material";

const JourneyCard = ({
  result,
  isAlternative = false,
  getTripDay,
  formatDuration,
}) => {
  const tripDay = getTripDay(result.route, result.departureStop.time);

  // Fonction pour créer les chips des jours de circulation
  const renderCirculationDays = () => {
    const daysMapping = {
      monday: { label: "L", color: "primary" },
      tuesday: { label: "Ma", color: "secondary" },
      wednesday: { label: "Me", color: "success" },
      thursday: { label: "J", color: "warning" },
      friday: { label: "V", color: "info" },
      saturday: { label: "S", color: "error" },
      sunday: { label: "D", color: "default" },
    };

    const weekDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    return (
      <Box display="flex" gap={0.5} justifyContent="center" mb={1}>
        {weekDays.map((day) => {
          const isActive = result.route.days.includes(day);
          const dayInfo = daysMapping[day];

          return (
            <Chip
              key={day}
              label={dayInfo.label}
              size="small"
              variant={isActive ? "filled" : "outlined"}
              color={isActive ? dayInfo.color : "default"}
              sx={{
                minWidth: "28px",
                height: "24px",
                fontSize: "0.75rem",
                fontWeight: isActive ? "bold" : "normal",
                backgroundColor: isActive ? undefined : "grey.100",
                borderColor: isActive ? undefined : "grey.300",
                color: isActive ? "white" : "grey.500",
              }}
            />
          );
        })}
      </Box>
    );
  };

  // Styling pour les cartes principales (routes directes)
  const getMainCardStyle = () => ({
    borderColor:
      tripDay.day === "today"
        ? "success.main"
        : tripDay.day === "tomorrow"
        ? "warning.main"
        : "grey.300",
    backgroundColor:
      tripDay.day === "today"
        ? "success.50"
        : tripDay.day === "tomorrow"
        ? "warning.50"
        : "grey.50",
  });

  if (isAlternative) {
    // Format simplifié pour les cartes alternatives
    return (
      <Card variant="outlined">
        <CardContent>
          <Chip
            label={`${result.line.name.replace("Ligne ", "")} - ${
              result.route.number
            }`}
            color="secondary"
            size="small"
            sx={{
              mb: 1,
              backgroundColor: result.line.color,
              color: "white",
            }}
          />
          <Typography variant="body2" gutterBottom>
            {result.departureStop.name} → {result.arrivalStop.name}
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{result.departureStop.time}</Typography>
            <DirectionsBus color="secondary" fontSize="small" />
            <Typography variant="h6">{result.arrivalStop.time}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {tripDay.label}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Format complet pour les cartes principales (routes directes)
  return (
    <Card variant="outlined" sx={getMainCardStyle()}>
      <CardContent>
        <Box mb={1}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item size={12} textAlign="center">
              <Chip
                label={`${result.line.name.replace("Ligne ", "")} - ${
                  result.route.number
                }`}
                color="primary"
                size="large"
                sx={{
                  mr: 1,
                  backgroundColor: result.line.color,
                  fontSize: "1.2rem",
                }}
              />
            </Grid>
            <Grid item size={12} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                {tripDay.label}
              </Typography>
            </Grid>
            <Grid item size={12} textAlign="center">
              <Divider sx={{ my: 1 }} />
            </Grid>
            <Grid item size={12} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Jours de circulation
              </Typography>
            </Grid>
            <Grid item size={12} textAlign="center">
              {renderCirculationDays()}
            </Grid>
          </Grid>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography variant="h6">{result.departureStop.time}</Typography>
            <Typography variant="body2" color="text.secondary">
              Départ
            </Typography>
          </Box>
          <Box textAlign="center">
            <DirectionsBus color="primary" />
            <Typography variant="body2">
              {formatDuration(result.duration)}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="h6">{result.arrivalStop.time}</Typography>
            <Typography variant="body2" color="text.secondary">
              Arrivée
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Typography variant="body2" color="text.secondary">
          {result.stops.length} arrêts • Direction: {result.route.direction}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JourneyCard;
