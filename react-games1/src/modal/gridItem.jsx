import "./GameFloor.css";
import { useState, useEffect } from "react";
import FootprintIcon from "../svgs/circle-shape-svgrepo-com (3).svg";
import AlertIcon from "../svgs/alert-svgrepo-com.svg";

export const GridItem = props => {
  const [showMove, setShowMove] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [innerTxt, setInnerTxt] = useState(null);
  const [winningColor, setWinningColor] = useState(false);

  useEffect(() => {
    if (!props.gameStatus) {
      if (props.tile.includes(props.id)) {
        setWinningColor(true);
      }
    }
  }, [props.gameStatus]);

  useEffect(() => {
    if (!props.showFloor) {
      setInnerTxt("");
      setWinningColor(false);
      setIsFilled(false);
    }
  }, [props.showFloor]);
  useEffect(() => {
    if (props.continue) {
      setInnerTxt("");
      setWinningColor(false);
      setIsFilled(false);
    }
  }, [props.continue]);
  const clicked = e => {
    if (!isFilled && props.gameStatus) {
      props.changeTurn();
      setShowMove(true);
      let player;
      if (props.playerChanged) {
        setInnerTxt(
          <img
            className="Foot--print--icon"
            src={FootprintIcon}
            alt="footprint-icon"
          />
        );
        player = 2;
        props.Winner(props.id, player);
      } else {
        setInnerTxt(
          <img className="Alert--icon" src={AlertIcon} alt="alert-icon" />
        );
        player = 1;
        props.Winner(props.id, player);
      }

      setIsFilled(true);
    }
  };

  return (
    <div
      className={`grid--ingredients ${winningColor ? "winner" : ""}`}
      onClick={e => clicked(e)}
    >
      {showMove ? innerTxt : null}
    </div>
  );
};
