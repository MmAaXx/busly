import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
      light: "#9bb0ff",
      dark: "#2f4fb7",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#764ba2",
      light: "#a576d3",
      dark: "#472373",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
    },
    info: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.1rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
    },
    button: {
      fontWeight: 500,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: 500,
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          color: "#2c3e50",
          boxShadow: "0 2px 20px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;
