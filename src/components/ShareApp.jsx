import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Paper,
  Slide,
} from "@mui/material";
import {
  Share,
  Close,
  QrCode,
  Download,
  ContentCopy,
} from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ShareApp = () => {
  const [open, setOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const appUrl = "https://mmaaxx.github.io/busly/";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 4 },
        mb: { xs: 2, sm: 4 },
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
        📤 Partager Busly
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Aidez vos amis à découvrir Busly ! Partagez l'application facilement
        avec un QR code ou un lien direct.
      </Typography>
      <Box
        display="flex"
        gap={2}
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems="center"
      >
        <Button
          variant="outlined"
          size="medium"
          startIcon={<QrCode />}
          onClick={() => setOpen(true)}
          sx={{
            m: "0 auto",
            borderColor: "primary.main",
            color: "primary.main",
            "&:hover": {
              backgroundColor: "primary.50",
              borderColor: "primary.dark",
            },
          }}
        >
          Partager l'app
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <QrCode color="primary" />
            <Typography variant="h6" component="span">
              Partager Busly
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpen(false)}
            size="small"
            sx={{ color: "grey.500" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Scannez ce QR code pour accéder à l'application
          </Typography>

          <Paper
            elevation={3}
            sx={{
              display: "inline-block",
              p: 3,
              mt: 2,
              mb: 3,
              borderRadius: 2,
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            }}
          >
            <QRCodeSVG
              id="qr-code-svg"
              value={appUrl}
              size={200}
              bgColor="#ffffff"
              fgColor="#1976d2"
              level="M"
              includeMargin={true}
            />
          </Paper>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Ou copiez le lien :
            </Typography>
            <Paper
              sx={{
                p: 2,
                backgroundColor: "grey.50",
                border: 1,
                borderColor: "grey.200",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  flex: 1,
                }}
              >
                {appUrl}
              </Typography>
              <IconButton
                onClick={handleCopyLink}
                size="small"
                color={copySuccess ? "success" : "primary"}
                sx={{ ml: 1 }}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Paper>
            {copySuccess && (
              <Typography
                variant="caption"
                color="success.main"
                sx={{ mt: 1, display: "block" }}
              >
                ✅ Lien copié !
              </Typography>
            )}
          </Box>

          <Box
            display="flex"
            gap={2}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mt: 3 }}
          >
            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={handleCopyLink}
              size="small"
              color={copySuccess ? "success" : "primary"}
            >
              {copySuccess ? "Copié !" : "Copier le lien"}
            </Button>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} variant="contained" fullWidth>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ShareApp;
