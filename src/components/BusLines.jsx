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
} from "@mui/material";
import {
  DirectionsBus,
  Today,
  WeekendOutlined,
  DateRangeOutlined,
} from "@mui/icons-material";
import BusLine from "./BusLine";
import busData from "../data/bus-lines.json";

const BusLines = () => {
  const [selectedLine, setSelectedLine] = useState(null);
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    if (dayOfWeek === 0) {
      setCurrentDay("sunday");
    } else if (dayOfWeek === 6) {
      setCurrentDay("saturday");
    } else {
      setCurrentDay("weekdays");
    }
  }, []);

  const handleLineSelect = (line) => {
    setSelectedLine(line);
  };

  const handleBack = () => {
    setSelectedLine(null);
  };

  const getDayInfo = () => {
    switch (currentDay) {
      case "weekdays":
        return {
          label: "Lundi - Vendredi",
          icon: <DateRangeOutlined />,
          color: "primary",
        };
      case "saturday":
        return {
          label: "Samedi",
          icon: <WeekendOutlined />,
          color: "secondary",
        };
      case "sunday":
        return { label: "Dimanche", icon: <Today />, color: "warning" };
      default:
        return { label: "Aujourd'hui", icon: <Today />, color: "default" };
    }
  };

  if (selectedLine) {
    return (
      <BusLine
        line={selectedLine}
        currentDay={currentDay}
        onBack={handleBack}
      />
    );
  }

  const dayInfo = getDayInfo();

  return (
    <Fade in timeout={500}>
      <Box>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: "white",
              fontWeight: 300,
              mb: 2,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Choisissez votre ligne de bus
          </Typography>

          <Paper
            elevation={3}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Chip
              icon={dayInfo.icon}
              label={`Horaires pour : ${dayInfo.label}`}
              color={dayInfo.color}
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          </Paper>
        </Box>

        <Grid container spacing={3}>
          {busData.lines.map((line) => (
            <Grid item xs={12} sm={6} md={4} key={line.id}>
              <Card
                elevation={6}
                sx={{
                  height: "100%",
                  borderLeft: `6px solid ${line.color}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: (theme) =>
                      `0 12px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px ${line.color}20`,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleLineSelect(line)}
                  sx={{ height: "100%", p: 0 }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        gap: 1,
                      }}
                    >
                      <DirectionsBus
                        sx={{
                          color: line.color,
                          fontSize: 28,
                        }}
                      />
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                        }}
                      >
                        {line.name}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: line.color,
                            flexShrink: 0,
                          }}
                        />
                        {line.direction1.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: line.color,
                            flexShrink: 0,
                          }}
                        />
                        {line.direction2.name}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Fade>
  );
};

export default BusLines;
