import React from "react"
import { Game } from "../GameBoard";

interface Props {
  game: Game
}

const GameStats = (props: Props) => {
  const { game } = props;
  
  return (
    <>
      <p>Correct: {game.correctAnswers}</p>
      <p>Incorrect: {game.incorrectAnswers}</p>
      <p>Total: {game.totalQuestions}</p>
    </>
    
  )
};

export { GameStats };
