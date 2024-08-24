"use client";
import { useState } from "react";

export const SearchBox = ({ onSearch }:{onSearch:Function}) => {
  const [city, setCity] = useState("");

  const getCity = (event:any) => {
    setCity(event.target.value);

  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(city);

    }
    

  };

  return (
    <div>
      <input
        type="search"
        className="w-[700px]
        text-black
        rounded-[30px]
        mr-[5px]
        h-[5vh]
   px-5
   focus:outline-[#FFD700] outline-[1px]
        "
        placeholder=" enter your city..."
        onChange={getCity}
        value={city}
      />
      <button className="bg-[#708090] rounded-[30px] text-white w-[100px] p-2 hover:bg-green-500" onClick={handleSearch}>Search</button>
    </div>
  );
};

