import "./sideDrawer.css";
import { DropBox } from "./dropBox";
import { Btn } from "../btn";
import React, { useState, useEffect } from "react";
export const Drawer = props => {
  const [BtnValue, setBtnValue] = useState();
  useEffect(() => {
    setBtnValue("play Again");
  }, []);
  console.log(props.winner);
  return (
    <>
      {props.gameStatus ? [] : <DropBox />}
      <div className={`drawer${props.gameStatus ? " deactive" : " active"}`}>
        <h3>game over!!!</h3>
        <p>{props.drawValue ? "its a draw" : `player${props.winner} won!!`} </p>
        <p>
          {" "}
          player one:{props.playerOne} player two : {props.playerTwo}
        </p>
        <Btn value={BtnValue} changeGameFlow={props.resetGame} />
        <Btn value="reset" changeGameFlow={props.resetScore} type="danger" />
      </div>
    </>
  );
};
