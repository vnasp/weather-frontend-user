import { useState } from "react"
import axios from "axios"
import Weather from "./components/Weather"
import {
  Box, Container, Typography, TextField, List, ListItemButton, ListItemText
} from "@mui/material"

export default function App() {
    const [weather, setWeather] = useState({})
    const [city, setCity] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [error, setError] = useState({
        error: false,
        message: "",
    })

    const API_SEARCH = "https://api.weatherapi.com/v1/search.json?key="
    const API_WEATHER = "https://api.weatherapi.com/v1/current.json?key="
    const TOKEN = import.meta.env.VITE_API_KEY

    const handleSearchChange = async (event) => {
        const value = event.target.value
        setCity(value)
        if (value.length > 2) {
            try {
                const response = await axios.get(API_SEARCH + TOKEN + "&q=" + value)
                setSuggestions(response.data)
                setError({ error: false, message: "" })
            } catch (error) {
                console.error('Failed to fetch suggestions:', error)
                setError({ error: true, message: "Error al cargar las sugerencias." })
            }
        } else {
            setSuggestions([])
            setError({ error: false, message: "" })
        }
    }

    const handleSuggestionClick = async (cityName) => {
      setCity(cityName)
      setSuggestions([])

      try {
          const response = await axios.get(API_WEATHER + TOKEN + "&lang=es&q=" + cityName)
          setWeather({
              city: response.data.location.name,
              country: response.data.location.country,
              temp: response.data.current.temp_c,
              condition: response.data.current.condition.code,
              icon: response.data.current.condition.icon,
              conditionText: response.data.current.condition.text,
              dia: response.data.current.is_day,
          })
          setCity("")
      } catch (error) {
          console.error('Failed to fetch weather data:', error)
          setError({ error: true, message: "No se pudo cargar la información del clima." })
      } 
  }

  return (
    <Container component={"main"}
    maxWidth={false}
    sx={{
      backgroundImage: 'url("./background.webp")',
      backgroundSize: "cover",
      backgroundPosition: "center 10%",
      height: "100vh",
      width: "100vw",
      p: 0,
      m: 0,
    }}
    >
  
      <Box maxWidth="xs" component={"div"} display="flex" justifyContent="center">
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
          size="large"
          value={city}
          onChange={handleSearchChange}
          error={error.error}
          helperText={error.message}
          sx={{ borderRadius: 2, mb:0 }}
        />
        {suggestions.length > 0 && (
          <List component="nav" sx={{ bgcolor: "background.paper", borderRadius:2 }}>
            {suggestions.map((item, index) => (
              <ListItemButton key={index} onClick={() => handleSuggestionClick(item.name + ", " + item.country)}>
                <ListItemText primary={item.name + ", " + item.country} />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
      <Weather weather={weather} />
    </Container>
  )
}
