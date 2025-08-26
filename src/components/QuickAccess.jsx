import {
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Alert,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Star,
  History,
  SwapHoriz,
  Delete,
  DirectionsBus,
  Schedule,
} from "@mui/icons-material";

const QuickAccess = ({
  favoriteStops,
  recentTrips,
  lastTrip,
  onStopSelect,
  onTripSelect,
  onRemoveFavoriteStop,
  onRemoveRecentTrip,
}) => {
  const formatTimeSince = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Il y a moins d'1h";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;

    return date.toLocaleDateString("fr-FR");
  };

  const handleStopClick = (stop) => {
    onStopSelect({
      lineId: stop.lineId,
      direction: stop.direction,
      stopName: stop.stopName,
    });
  };

  const handleTripClick = (trip) => {
    onTripSelect(trip);
  };

  const reverseTrip = (trip) => {
    return {
      ...trip,
      fromStop: trip.toStop,
      toStop: trip.fromStop,
    };
  };

  const hasData =
    favoriteStops.length > 0 || recentTrips.length > 0 || lastTrip;

  if (!hasData) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
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
        <Schedule sx={{ color: "primary.main" }} />
        Accès rapide
      </Typography>

      {/* Dernier trajet utilisé */}
      {lastTrip && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 1,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <History fontSize="small" />
            Dernier trajet
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              icon={<DirectionsBus />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {lastTrip.fromStop.stopName}
                  </Typography>
                  <SwapHoriz fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {lastTrip.toStop.stopName}
                  </Typography>
                </Box>
              }
              onClick={() => handleTripClick(lastTrip)}
              sx={{
                backgroundColor: `${lastTrip.fromStop.lineColor}15`,
                color: lastTrip.fromStop.lineColor,
                borderColor: lastTrip.fromStop.lineColor,
                border: 1,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: `${lastTrip.fromStop.lineColor}25`,
                },
              }}
            />
            <Tooltip title="Trajet retour">
              <Chip
                icon={<SwapHoriz sx={{ transform: "rotate(180deg)" }} />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {lastTrip.toStop.stopName}
                    </Typography>
                    <SwapHoriz fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {lastTrip.fromStop.stopName}
                    </Typography>
                  </Box>
                }
                onClick={() => handleTripClick(reverseTrip(lastTrip))}
                variant="outlined"
                sx={{
                  borderColor: lastTrip.toStop.lineColor,
                  color: lastTrip.toStop.lineColor,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: `${lastTrip.toStop.lineColor}15`,
                  },
                }}
              />
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* Arrêts favoris */}
      {favoriteStops.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 1,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Star fontSize="small" sx={{ color: "warning.main" }} />
            Arrêts favoris
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {favoriteStops.map((stop) => (
              <Chip
                key={stop.id}
                icon={<DirectionsBus />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {stop.stopName}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      ({stop.lineName})
                    </Typography>
                  </Box>
                }
                deleteIcon={<Delete />}
                onDelete={() => onRemoveFavoriteStop(stop.id)}
                onClick={() => handleStopClick(stop)}
                sx={{
                  backgroundColor: `${stop.lineColor}15`,
                  color: stop.lineColor,
                  borderColor: stop.lineColor,
                  border: 1,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: `${stop.lineColor}25`,
                  },
                  "& .MuiChip-deleteIcon": {
                    color: stop.lineColor,
                    "&:hover": {
                      color: "error.main",
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Trajets récents */}
      {recentTrips.length > 0 && (
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 1,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <History fontSize="small" />
            Trajets récents
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {recentTrips.slice(0, 3).map((trip) => (
              <Box
                key={trip.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: "grey.50",
                  "&:hover": {
                    backgroundColor: "grey.100",
                  },
                }}
              >
                <Chip
                  icon={<DirectionsBus />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {trip.fromStop.stopName}
                      </Typography>
                      <SwapHoriz fontSize="small" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {trip.toStop.stopName}
                      </Typography>
                    </Box>
                  }
                  onClick={() => handleTripClick(trip)}
                  size="small"
                  sx={{
                    backgroundColor: `${trip.fromStop.lineColor}15`,
                    color: trip.fromStop.lineColor,
                    cursor: "pointer",
                    flexGrow: 1,
                  }}
                />

                <Typography variant="caption" color="text.secondary">
                  {formatTimeSince(trip.lastUsed)}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {trip.usageCount}x
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => onRemoveRecentTrip(trip.id)}
                  sx={{ color: "text.secondary" }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default QuickAccess;
