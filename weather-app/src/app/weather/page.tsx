"use client";
import { useState } from "react";
import { WeatherPage } from "@/components/weatherPage";
import { SearchBox } from "@/components/searchArea";
import { UserCoordsProvider } from "@/components/userCoords";
import WeatherLayer from "@/components/weatherLayers";
export default function Weather() {
  const [targetCity, setTargetCity] = useState("");

  const handleCitySearch = (city: any) => {
    setTargetCity(city);
  };
  return (
    <>
      <div className="flex flex-col "> 
        <div className="right-10 my-5 mr-10 text-right" >
          <SearchBox onSearch={handleCitySearch} />{" "}
        </div>
        <div className="flex flex-row w-[100vw]">
          <UserCoordsProvider>
           <div className="basis-1/2"><WeatherPage city={targetCity} /></div> 
       <div className="basis-1/2">     <WeatherLayer /></div>
          </UserCoordsProvider>
        </div>
      </div>
    </>
  );
}
