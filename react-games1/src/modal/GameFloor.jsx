import "./GameFloor.css";
import React, { useState, useEffect } from "react";
import { GridItem } from "./gridItem";
import { Btn } from "./btn";
import { Drawer } from "./sideDrawer/sideDrawer";
const Floor = () => {
  const [playerChanged, setPlayerChanged] = useState(false);
  const [moves, setMoves] = useState([]);
  const [winnerTile, setWinnerTiel] = useState([]);
  const [game, setGame] = useState(true);
  const [gameStarter, setGameStarter] = useState("start");
  const [showFloor, setShowFloor] = useState(false);
  const [winner, setWinner] = useState("");
  const [continueGame, setContinueGame] = useState();
  const [playerOneScore, setPlayerOneScore] = useState(0);
  const [playerTwoScore, setPlayerTwoScore] = useState(0);
  const [drawValue, setDrawValue] = useState(false);
  const resetScore = () => {
    setPlayerTwoScore(0);
    setPlayerOneScore(0);
  };
  const playerHandler = () => {
    setPlayerChanged(!playerChanged);
  };
  const changeGameFlow = () => {
    setShowFloor(!showFloor);
  };
  useEffect(() => {
    if (showFloor) {
      setGameStarter("stop");
      resetGame();
    } else {
      setGameStarter("start");
    }
  }, [showFloor]);
  const winCondition = (id, player) => {
    setMoves(prevMoves => [...prevMoves, { id, player }]);
    checkWinners();
  };
  useEffect(() => {
    checkWinners();
  }, [moves]);
  const resetGame = () => {
    setMoves([]);
    setWinnerTiel([]);
    setGame(true);
    setPlayerChanged(false);
    setWinner([]);
    setDrawValue(false);
  };
  const checkWinners = () => {
    const winningCombinations = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7]
    ];

    for (const comb of winningCombinations) {
      const [a, b, c] = comb;

      const positionA = moves.find(move => move.id === a);
      const positionB = moves.find(move => move.id === b);
      const positionC = moves.find(move => move.id === c);

      if (positionA && positionB && positionC) {
        if (
          positionA.player === positionB.player &&
          positionB.player === positionC.player
        ) {
          console.log(`Player ${positionA.player} wins!`);
          setWinner(positionA.player);
          setGame(false);
          setWinnerTiel([a, b, c]);
          setContinueGame(false);
        }
      }
    }
    if (moves.length === 9 &&( (positionA.player ===! positionB.player) ||
      (positionB.player ===! positionC.player ))) {
      setGame(false);
      setWinner("Draw");
      setContinueGame(false);
    }
  };

  useEffect(() => {
    switch (winner) {
      case 1:
        setPlayerOneScore(latestScore => latestScore + 1);

        break;
      case 2:
        setPlayerTwoScore(latestScore => latestScore + 1);

        break;
      case "Draw":
        setDrawValue(true);
    }
  }, [winner]);

  return (
    <div className="floor--Wrapper">
      <Btn value={gameStarter} changeGameFlow={changeGameFlow} />
      <Drawer
        resetGame={() => {
          resetGame();
          setContinueGame(true);
        }}
        drawValue={drawValue}
        winner={winner}
        gameStatus={game}
        playerOne={playerOneScore}
        playerTwo={playerTwoScore}
        resetScore={resetScore}
      />
      <div className={showFloor ? "containor" : "deactive"}>
        <GridItem
          id={1}
          tile={winnerTile}
          gameStatus={game}
          continue={continueGame}
          changeTurn={playerHandler}
          playerChanged={playerChanged}
          Winner={(id, player) => winCondition(id, player)}
          showFloor={showFloor}
        />
        <GridItem
          id={2}
          tile={winnerTile}
          gameStatus={game}
          continue={continueGame}
          changeTurn={playerHandler}
          showFloor={showFloor}
          playerChanged={playerChanged}
          Winner={(id, player) => winCondition(id, player)}
        />
        <GridItem
          id={3}
          tile={winnerTile}
          gameStatus={game}
          continue={continueGame}
          changeTurn={playerHandler}
          showFloor={showFloor}
          playerChanged={playerChanged}
          Winner={(id, player) => winCondition(id, player)}
        />
        <GridItem
          id={4}
          tile={winnerTile}
          gameStatus={game}
          continue={continueGame}
          changeTurn={playerHandler}
          showFloor={showFloor}
          playerChanged={playerChanged}
          Winner={(id, player) => winCondition(id, player)}
        />
        <GridItem
          id={5}
          tile={winnerTile}
          gameStatus={game}
          continue={continueGame}
          changeTurn={playerHandler}
          showFloor={showFloor}
          playerChanged={playerChanged}
          Winner={(id, player) => winCondition(id, player)}
        />
        <GridItem
          id={6}
          tile={winnerTile}
          gameStatus={game}
          continue={continueGame}
          changeTurn={playerHandler}
          showFloor={showFloor}
          playerChanged={playerChanged}
          Winner={(id, player) => winCondition(id, player)}
        />
        <GridItem
          id={7}
          tile={winnerTile}
          gameStatus={game}
          continue={continueGame}
          changeTurn={playerHandler}
          showFloor={showFloor}
          playerChanged={playerChanged}
          Winner={(id, player) => winCondition(id, player)}
        />
        <GridItem
          id={8}
          tile={winnerTile}
          gameStatus={game}
          continue={continueGame}
          changeTurn={playerHandler}
          showFloor={showFloor}
          playerChanged={playerChanged}
          Winner={(id, player) => winCondition(id, player)}
        />
        <GridItem
          id={9}
          tile={winnerTile}
          gameStatus={game}
          continue={continueGame}
          changeTurn={playerHandler}
          showFloor={showFloor}
          playerChanged={playerChanged}
          Winner={(id, player) => winCondition(id, player)}
        />
      </div>
      <h2 className="turn__displayer">
        {" "}
        {showFloor ? `TURN: ${playerChanged ? "player 2 " : "player 1"}` : []}
      </h2>
    </div>
  );
};
export default React.memo(Floor);
