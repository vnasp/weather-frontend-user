import { Box, Typography } from "@mui/material";

export default function Weather({ weather }) {
  return (
    <>
      {weather.city && (
        <Box
          component="section"
          color={weather.dia === 1 ? "black" : "white"}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="top"
          border={2}
          sx={{
            width: "auto", 
            height: 400,
            backgroundImage:
              weather.dia === 1 ? 'url("./dia.webp")' : 'url("./noche.webp")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            p:8,
            borderRadius: 2,
            mt: 2,
          }}
        >
          <Typography variant="h6" component="h2" align="center" sx={{mt:-4, mb:4}}>
            {weather.city}, {weather.country}
          </Typography>
              <img src={weather.icon} alt={weather.conditionText}/>
              <Typography variant="body1" align="center">
                {weather.conditionText}
              </Typography>
          
            <Typography variant="h1" component="h3" align="center">
              {weather.temp}°C
            </Typography>
        </Box>
      )}
      <Box component={"footer"}>
        <Typography textAlign="center" sx={{ mt: 2, fontSize: "10px" }}>
          Powered by:{" "}
          <a href="https://www.weatherapi.com/" title="Weather API">
            WeatherAPI.com
          </a>
        </Typography>
      </Box>
    </>
  );
}
