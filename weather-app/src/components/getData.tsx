"use client";
import { useUserTarget } from "@/components/userTargetContext";
import { useEffect, useState } from "react";
import {DisplayBox} from "@/components/UI/DataDisplay"
   
export default function WeatherData({ Data }:{Data:any}) {
    const { userTarget }:any = useUserTarget();
    const [requestedDate, setRequestedDate] = useState([]);
    const [dailyDate, setDailyDate] = useState([]);

    useEffect(() => {
        const specificDay = new Date();
        specificDay.setDate(specificDay.getDate() + userTarget);
        const specificDayStringify = specificDay.toLocaleDateString();

        const filteredData:any = Data.list.filter(
            (entry:any) =>
                new Date(entry.dt * 1000).toLocaleDateString() === specificDayStringify
        );
    setDailyDate(specificDayStringify)
        setRequestedDate(filteredData);
    }, [Data, userTarget]); 
    
    return (
        <>
            <div>
           
                <h1 className="text-[#FFD700] text-center text-bold text-[30px]">5-Day Weather Forecast of </h1>
                <h1 className="text-[#FFD700] text-center text-bold text-[30px]">{userTarget===0?"today":(userTarget===1? "tomarrow":<p>{dailyDate}</p> ) }</h1>
                {requestedDate.length === 0 ? (
                    <p className="text-[#FFD700] text-center text-bold text-[30px]">No weather data available for this date ({dailyDate})</p>
                ) : (
                                       <DisplayBox requestedDate={requestedDate}/>
                  
                )}
            </div>
        </>
    );
}


