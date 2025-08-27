import { useState, useEffect } from "react";
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
} from "@mui/material";
import { DirectionsBus, Schedule } from "@mui/icons-material";
import BusRoutesView from "./components/BusRoutesView";
import theme from "./theme";

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            // Protection pour iOS - empêche le contenu de passer derrière la barre de statut
            paddingTop: "env(safe-area-inset-top)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "env(safe-area-inset-top)",
              backgroundColor: "primary.main",
              zIndex: -1,
            },
          }}
        >
          <Toolbar>
            <Box
              component="img"
              src="/busly/busly-logo.png"
              alt="Busly Logo"
              sx={{
                height: 40,
                mr: 2,
              }}
              onError={(e) => {
                // Fallback vers l'icône si le logo n'est pas trouvé
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "inline-flex";
              }}
            />
            <DirectionsBus
              sx={{
                mr: 2,
                fontSize: 28,
                display: "none", // Caché par défaut, affiché si logo fail
              }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontFamily: "Courier New, monospace",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Schedule fontSize="small" />
                {formatTime(currentTime)}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textTransform: "capitalize",
                  opacity: 0.8,
                }}
              >
                {formatDate(currentTime)}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ flex: 1, py: 2, px: 1 }}>
          <BusRoutesView />
        </Container>

        <Paper
          component="footer"
          elevation={0}
          sx={{
            mt: "auto",
            py: 2,
            textAlign: "center",
            borderRadius: 0,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Busly - Votre compagnon pour les horaires de bus 📱
          </Typography>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;
