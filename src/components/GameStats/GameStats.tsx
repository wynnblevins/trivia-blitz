import React from "react"
import { Game } from "../GameBoard";
import { WithStyles, createStyles, withStyles } from "@material-ui/core";

interface Props extends WithStyles {
  game: Game
}

const styles = createStyles({
  stat: {
    textAlign: 'center'
  },
})

const GameStatsBase = (props: Props) => {
  const { game, classes } = props;
  
  return (
    <div>
      <h2 className={classes.stat}>Stats</h2>
      <p className={classes.stat}>Correct: {game.correctAnswers}</p>
      <p className={classes.stat}>Incorrect: {game.incorrectAnswers}</p>
      <p className={classes.stat}>Total: {game.totalQuestions}</p>
    </div>
    
  )
};

const GameStats = withStyles(styles)(GameStatsBase)
export { GameStats };
