import { useState } from "react";
import axios from "axios";
import Weather from "./components/Weather";
import {
  Box,
  Container,
  Typography,
  TextField,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

export default function App() {
  const [weather, setWeather] = useState({});
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const API_SEARCH = "https://api.weatherapi.com/v1/search.json?key=";
  const API_WEATHER = "https://api.weatherapi.com/v1/current.json?key=";
  const TOKEN = import.meta.env.VITE_API_KEY;

  const handleSearchChange = async (event) => {
    const value = event.target.value;
    setCity(value);
    if (value.length > 2) {
      try {
        const response = await axios.get(API_SEARCH + TOKEN + "&q=" + value);
        setSuggestions(response.data);
        setError({ error: false, message: "" });
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setError({ error: true, message: "Error al cargar las sugerencias." });
      }
    } else {
      setSuggestions([]);
      setError({ error: false, message: "" });
    }
  };

  const handleSuggestionClick = async (cityName) => {
    setCity(cityName);
    setSuggestions([]);

    try {
      const response = await axios.get(
        API_WEATHER + TOKEN + "&lang=es&q=" + cityName
      );
      setWeather({
        city: response.data.location.name,
        country: response.data.location.country,
        temp: response.data.current.temp_c,
        condition: response.data.current.condition.code,
        icon: response.data.current.condition.icon,
        conditionText: response.data.current.condition.text,
        dia: response.data.current.is_day,
      });
      setCity("");
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      setError({
        error: true,
        message: "No se pudo cargar la información del clima.",
      });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <Container
      maxWidth="sm"
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
      }}
    >
      <Box component={"div"} display="flex" justifyContent="center" sx={{ pt: 4 }}>
        <img src="./logo.webp" alt="Aplicación del Clima" height={55} />
        <Typography
          variant="h3"
          component="h1"
          align="center"
          sx={{
            fontWeight: "bold",
            fontStyle: "italic",
            textTransform: "uppercase",
            letterSpacing: "2px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          Clima
        </Typography>
      </Box>
      <Box
        sx={{ display: "grid", gap: 2, py: 3 }}
        component={"form"}
        onSubmit={SubmitEvent}
      >
        <TextField
          id="ciudad"
          label="Ciudad, País"
          variant="outlined"
          color="success"
          size="large"
          value={city}
          onChange={handleSearchChange}
          error={error.error}
          helperText={error.message}
          sx={{ borderRadius: 2, mb: 0 }}
        />
        {suggestions.length > 0 && (
          <List
            component="nav"
            sx={{ bgcolor: "background.paper", borderRadius: 2 }}
          >
            {suggestions.map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() =>
                  handleSuggestionClick(item.name + ", " + item.country)
                }
              >
                <ListItemText primary={item.name + ", " + item.country} />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
      <Weather weather={weather} />
      <Box component={"footer"}>
        <Typography
          component={"div"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{
            mt: 2,
            fontSize: "10px",
            "& a": {
              color: "primary.main",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
          }}
        >
          <p> © {currentYear} Todos los derechos reservados</p>
          <p>
            {" "}
            Sitio creado con{" "}
            <a
              href="https://reactjs.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ReactJS
            </a>{" "}
            y{" "}
            <a
              href="https://mui.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Material UI
            </a>
          </p>{" "}
          <p>
            Powered by:{" "}
            <a href="https://www.weatherapi.com/" title="Weather API">
              WeatherAPI.com
            </a>
          </p>
        </Typography>
      </Box>
    </Container>
  );
}
