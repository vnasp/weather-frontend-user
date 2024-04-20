import { Box, Container, Typography, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { useState } from "react";
import Weather from "./components/Weather";

export default function App() {
  const [weather, setWeather] = useState({});
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const API_WEATHER = "http://api.weatherapi.com/v1/current.json?key=";
  const TOKEN = VITE_API_KEY
  const SEARCH = "&lang=es&q=";

  const SubmitEvent = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError({
      error: false,
      message: "",
    });
    if (city.trim() !== "" && city.trim().length > 2) {
      try {
        const response = await axios.get(API_WEATHER + TOKEN + SEARCH + city);
        const data = response.data;
        setWeather({
          city: data.location.name,
          country: data.location.country,
          temp: data.current.temp_c,
          condition: data.current.condition.code,
          icon: data.current.condition.icon,
          conditionText: data.current.condition.text,
          dia: data.current.is_day,
        });
        setCity("");
      } catch (error) {
        console.error(error);
        setError({ error: true, message: "Error al cargar los datos del clima." });
      } finally {
        setLoading(false);
      }
    } else {
      setError({ error: true, message: "Ingresa una ciudad válida" });
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="xs" sx={{ mt: "2rem", width:"100vw"}}>
      <Box component={"div"} display="flex" justifyContent="center">
        <img src="./logo.webp" alt="CLIMApp" height={55} />
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
          size="small"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          error={error.error}
          helperText={error.message}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Cargando..."
          color="success"
          size="large"
        >
          Buscar
        </LoadingButton>
      </Box>
      <Weather weather={weather} />
    </Container>
  );
}
