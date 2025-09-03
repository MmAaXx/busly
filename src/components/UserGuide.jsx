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
  Divider,
  Link,
  Button,
} from "@mui/material";
import {
  Star,
  History,
  SwapHoriz,
  TouchApp,
  ExpandMore,
  ExpandLess,
  Info,
  Feedback,
  PhoneAndroid,
  OpenInNew,
} from "@mui/icons-material";
import { useState } from "react";

const UserGuide = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
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
          💡 Guide d'utilisation de Busly
        </Typography>
        <IconButton size="small">
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ px: 2, pb: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            💡 Cette application sauvegarde automatiquement votre dernière
            recherche
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              💾 Vos recherches sont sauvegardées localement dans votre
              navigateur. Elles restent privées et ne sont pas partagées.
            </Typography>
          </Alert>

          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Comment utiliser Busly :
          </Typography>

          <List dense>
            <ListItem>
              <ListItemIcon>
                <TouchApp color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Planifier un voyage"
                secondary="Sélectionnez votre point de départ et d'arrivée, puis cliquez sur 'Planifier le voyage'"
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <SwapHoriz color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary="Inverser le trajet"
                secondary="Utilisez le bouton 🔄 pour inverser départ et arrivée rapidement"
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <History color="action" />
              </ListItemIcon>
              <ListItemText
                primary="Recherche sauvegardée"
                secondary="Votre dernière recherche est automatiquement sauvegardée et restaurée à chaque visite"
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Star color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="Couleurs des résultats"
                secondary="🟢 Aujourd'hui | 🟡 Demain | ⚪ Heure passée ou pas de circulation"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Liens utiles :
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              component={Link}
              href="https://forms.gle/DmSbedoyiTQ7umEs9"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<Feedback />}
              endIcon={<OpenInNew />}
              variant="outlined"
              size="small"
              sx={{ justifyContent: "flex-start" }}
            >
              📝 Donner son avis et signaler des bugs
            </Button>

            <Button
              component={Link}
              href="https://github.com/MmAaXx/busly/blob/main/docs/installation-pwa.md"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<PhoneAndroid />}
              endIcon={<OpenInNew />}
              variant="outlined"
              size="small"
              sx={{ justifyContent: "flex-start" }}
            >
              📱 Installer l'app sur votre téléphone
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default UserGuide;
