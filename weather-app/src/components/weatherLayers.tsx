"use client";
import { useState } from "react";
import WeatherMap from "./weatherMap";

export default function WeatherLayer() {
  const [Layer, setLayer] = useState();

  const SpecificLayer = (e) => {
    setLayer(e.target.value);
  };

  return (
    <>
      <div> 
        <div className=" fixed m-3 right-5 z-50 text-black">
          <form className="flex flex-col">
            <h1  className="mx-4">choose your preferred layer</h1>
            <label>
              <input  
              className="mx-4"
                onChange={SpecificLayer}
                type="radio"
                name="weatherLayer"
                value="wind_new"
              />
              wind layer
            </label>

            <label>
              <input
              className="mx-4"

                onChange={SpecificLayer}
                type="radio"
                name="weatherLayer"
                value="pressure_new"
              />
              pressure layer
            </label>

            <label>
              <input
              className="mx-4"

                onChange={SpecificLayer}
                type="radio"
                name="weatherLayer"
                value="rain_new"
              />
              rain layer
            </label>

            <label>
              <input
              className="mx-4"

                onChange={SpecificLayer}
                type="radio"
                name="weatherLayer"
                value="clouds_new"
              />
              clouds layer
            </label>

            <label>
              <input
              className="mx-4"

                onChange={SpecificLayer}
                type="radio"
                name="weatherLayer"
                value="precipitation_new"
              />
              precipitation layer
            </label>
          </form>
        </div>
        <div className="relative z-0  bottom-0 right-0"> <WeatherMap Layer={Layer} /></div>
      </div>
    </>
  );
}
