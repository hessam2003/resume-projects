import ArrowBtn from "@/components/arrow";
import WeatherData from "@/components/getData";
import { UserTargetProvider } from "@/components/userTargetContext";
import {useUserCoord} from "@/components/userCoords"
import { useEffect, useState } from "react";

export const WeatherPage = ({ city }: { city: string }) => {
  const apiKey = "b92c60ad414507efe769913d207a7fbd";
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useUserCoord(); 
console.log(coords)
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (city) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
          );

          if (!response.ok) {
            throw new Error(
              `Error fetching current weather: ${response.statusText}`
            );
          }

          const locationData = await response.json();
          const { lat, lon } = locationData.coord;
          setCoords({ lat, lon });
          const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
          );

          if (!forecastResponse.ok) {
            throw new Error(
              `Error fetching forecast data: ${forecastResponse.statusText}`
            );
          }

          const weatherData = await forecastResponse.json();
          setWeatherData(weatherData);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWeatherData();
  }, [city]);

  if (loading) {
    return <div className="text-[#FFD700] text-center text-bold text-[30px] my-[100px]">Loading...</div>; 
  }

  if (error) {
    return <div className="text-[#FFD700] text-center text-bold text-[30px] text-red-700  my-[100px]">Error: {error}</div>; 
  } 

  return (
    <UserTargetProvider>
      {weatherData ? <ArrowBtn /> : []}
      {weatherData ? (
        <WeatherData Data={weatherData} />
      ) : (
        <div className="text-[#FFD700] text-center text-bold text-[30px]  my-[100px]">please choose your city </div>
      )}
    </UserTargetProvider>
  );
};
