import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudRain, faDroplet, faSun, faWind, faCloudShowersHeavy, faSnowflake, faCloudMoon, faMoon, faCloudSun } from '@fortawesome/free-solid-svg-icons';


type WeatherDataTypes = {
    main: {
        humidity: number;
        temp: number;
    };
    wind: { speed: number };
    weather: Array<{ description: string }>;
    dt: number;
};

export const DisplayBox = ({ requestedDate }: { requestedDate: WeatherDataTypes[] }) => {
    return (
        < div className='flex box-content mx-auto p-4 text-center max-w-[1200px] text-center justify-center gap-4 flex-wrap '>
            {requestedDate.map((data) => {
                const LocalTime = new Date(data.dt * 1000).toLocaleTimeString();
                const hour = new Date(data.dt * 1000).getHours(); 
                let icon;
let IconColor;
                if (hour < 5 || hour > 18) { 
                    switch (data.weather[0].description) {
                        case "clear sky":
                            icon = faMoon;
                            IconColor="text-gray-500"
                            break;
                        case "few clouds":
                        case "scattered clouds":
                        case "broken clouds":
                            icon = faCloudMoon;
                            break;
                        case "shower rain":
                        case "rain":
                            icon = faCloudShowersHeavy;
                            IconColor="text-blue-500"
                            break;
                        case "snow":
                            icon = faSnowflake;
                            IconColor="text-white-500"
                            break;
                        default:
                            icon = faCloudRain; 
                            IconColor="text-blue-500"
                            break;
                    }
                } else {
                    switch (data.weather[0].description) {
                        case "clear sky":
                            icon = faSun;
                            IconColor="text-yellow-500"
                            break;
                        case "few clouds":
                        case "scattered clouds":
                        case "broken clouds":
                            icon = faCloudSun;
                            break;
                        case "shower rain":
                        case "rain":
                            icon = faCloudShowersHeavy;
                            IconColor="text-blue-500"
                            break;
                        case "snow":
                            icon = faSnowflake;
                            IconColor="text-white-500"
                            break;
                        default:
                            icon = faCloudRain; 
                            IconColor="text-blue-500"
                            break;
                    }
                }
                
                return (
                    
                    <div key={data.dt} >
                        <div className=" border border-[#FFD700]  rounded-[10px] border-solid  p-4 w-[160px] text-center mb-[10px] rounded-5 h-[236px]">
                            <div className="border-b border-black text-[20px]"  >
                                {LocalTime}
                               <p className= {`text-[30px] ${IconColor}`}><FontAwesomeIcon  icon={icon} /></p> 
                            </div>
                            <div className="text-[30px] text-[#FFD700]">{(data.main.temp - 273.15).toFixed(1)} °C</div>
                            <div>
                                <FontAwesomeIcon className={IconColor} icon={icon} /> {data.weather[0].description}
                            </div>
                            <div>
                                <FontAwesomeIcon  className="text-blue-500" icon={faDroplet} /> {data.main.humidity}%
                            </div>
                            <div>
                                <FontAwesomeIcon className="text-lightblue-500"  icon={faWind} /> {data.wind.speed} m/s
                            </div>
                        </div>
                    </div>
                   );
            })}
        </div>
    );
};
