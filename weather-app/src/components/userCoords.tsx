import React, { createContext, useContext, useState } from 'react';

const UserCoordsContext = createContext("");

export const UserCoordsProvider = ({ children }:{children:any}) => {
    const [coords, setCoords] = useState({ lat: 40, lon: 100 });
    return (
        <UserCoordsContext.Provider value={{ coords, setCoords }}>
            {children}
        </UserCoordsContext.Provider>
    );
};

export const useUserCoord = () => {
    const context = useContext(UserCoordsContext);
    if (!context) {
        throw new Error("useUserCoord must be used within a UserCoordsProvider");
    } console.log(context.coords)
    return [context.coords, context.setCoords]; // Return as an array
};

