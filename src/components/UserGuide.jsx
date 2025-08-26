import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Star,
  History,
  SwapHoriz,
  TouchApp,
  ExpandMore,
  ExpandLess,
  Info,
} from "@mui/icons-material";
import { useState } from "react";

const UserGuide = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 3,
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          cursor: "pointer",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 500,
          }}
        >
          <Info color="primary" />
          Guide d'utilisation
        </Typography>
        <IconButton size="small">
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ px: 2, pb: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            💡 Cette application sauvegarde automatiquement vos préférences dans
            votre navigateur
          </Alert>

          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Comment utiliser l'application :
          </Typography>

          <List dense>
            <ListItem>
              <ListItemIcon>
                <TouchApp color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Sélectionner un arrêt"
                secondary="Cliquez sur une ligne de bus, puis sur un arrêt pour voir les horaires"
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Star color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="Ajouter aux favoris"
                secondary="Cliquez sur l'étoile ⭐ à côté d'un arrêt pour l'ajouter aux favoris"
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <History color="action" />
              </ListItemIcon>
              <ListItemText
                primary="Accès rapide"
                secondary="Vos arrêts favoris et trajets récents apparaissent en haut pour un accès rapide"
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <SwapHoriz color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary="Trajet retour"
                secondary="Utilisez les boutons de trajet retour pour l'aller-retour domicile ↔ école"
              />
            </ListItem>
          </List>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            💾 Toutes vos préférences sont sauvegardées localement dans votre
            navigateur. Elles ne sont pas partagées et restent privées.
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default UserGuide;
