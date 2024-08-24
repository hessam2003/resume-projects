"use client";
import { useUserTarget } from "@/components/userTargetContext";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
export default function ArrowBtn() {
  const { userTarget, setUserTarget }:any = useUserTarget();

  const PreviousData = () => {
    if (userTarget > 0) {
      setUserTarget((number:number) => number - 1);
    }
  };
  const nextData = () => {
    if (userTarget < 4) {
      setUserTarget((number:number) => number + 1);
    }
  };
  return (
    <div className="flex justify-between items-center ml-5">
    <div className="text-left">
      <button
        className={
          userTarget === 0
            ? "opacity-50 cursor-not-allowed"
            : "text-white hover:text-[#FFD700]"
        }
        onClick={PreviousData}
      >
        <FontAwesomeIcon className="text-[40px]" icon={faArrowLeft} />
      </button>
    </div>
    <div className="text-right">
      <button
        className={
          userTarget === 4
            ? "opacity-50 cursor-not-allowed"
            : "text-white hover:text-[#FFD700]"
        }
        onClick={nextData}
      >
        <FontAwesomeIcon className="text-[40px]" icon={faArrowRight} />
      </button>
    </div>
  </div>
  
  );
}
