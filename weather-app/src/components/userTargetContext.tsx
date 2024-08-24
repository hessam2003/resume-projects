"use client";
import React, { createContext, useContext, useState } from 'react';

const UserTargetContext = createContext("");
export const UserTargetProvider = ({ children }:{children:any}) => {
  const [userTarget, setUserTarget] = useState(0);
  return (
    <UserTargetContext.Provider value={{ userTarget, setUserTarget} }>
      {children}
    </UserTargetContext.Provider>
  );
};

export const useUserTarget = () => {
  const context = useContext(UserTargetContext);
  if (!context) {
    throw new Error("useUserTarget must be used within a UserTargetProvider");
  }
  return context;
};


  
