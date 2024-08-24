  
"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useUserCoord } from "@/components/userCoords";

const WeatherMap = (props) => {
  const mapRef = useRef<L.Map | null>(null);
  const [coords] = useUserCoord();
const Layer = props.Layer;

  const lat = coords.lat; 
  const lon = coords.lon;  

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lon], 8);
    } else {
      mapRef.current = L.map("map").setView([lat, lon], 8);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
      const APIkey = "46f80c469315039c8577b7d4c10bb558";
      const snowLayer = L.tileLayer(
        `https://{s}.tile.openweathermap.org/map/${Layer}/{z}/{x}/{y}?appid=${APIkey}`,
        {
          maxZoom: 19,
          attribution: "Weather data © OpenWeatherMap",
        }
      );

      snowLayer.addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coords,Layer]);

  return (
    <div
      id="map"
      style={{
        height: "89vh",
        margin: "0",
        border: "5px solid gold",
        borderRadius: "66px",
      }}
    ></div>
  );
};

export default WeatherMap;

