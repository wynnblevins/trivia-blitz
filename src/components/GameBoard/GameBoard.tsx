import React, { useEffect, useState } from "react";
import { QuestionChoice, QuestionDisplay } from "../QuestionDisplay";
import { QuestionObj, requestQuestion } from "../../services/questionService";
import { GameStats } from "../GameStats";
import { retrieveToken } from "../../services/tokenService";
import { timer } from '../../services/timerService';
import useSound from "use-sound";
import correctSound from '../../audio/correct.mp3';
import wrongSound from '../../audio/wrong.wav';
import timesUpSound from '../../audio/timesup.mp3';
import { Grid, createStyles, withStyles } from "@material-ui/core";

export interface Game {
  incorrectAnswers: number;
  correctAnswers: number;
  totalQuestions: number;
}

const styles = createStyles({
  loadingMsg: {
    textAlign: 'center'
  },
  resultLabel: {
    display: 'inline-block',
    marginRight: '10px',
    float: 'right'
  },
  correctAnswer: {
    float: 'left'
  },
  nextBtn: {
    display: 'inline-block',
    marginTop: '15px',
    marginBottom: '15px',
    marginLeft: '10px'
  },
  resultsContainer: { 
    display: 'flex' 
  },
  questionContainer: { 
    outline: "1px solid white"
  },
  scoreContainer: {
    outline: "1px solid white"
  }  
})

const GameBoardBase = (props: any) => {
  const { classes } = props;
  
  const FIVE_SECONDS = 5000;
  const [gameObj, setGameObj] = useState<Game>({
    incorrectAnswers: 0,
    correctAnswers: 0,
    totalQuestions: 0,
  });
  const [questionObj, setQuestionObj] = useState<QuestionObj | null>(null)
  const [token, setToken] = useState('');
  const [remainingTime, setRemainingTime] = useState<number>(20);
  const [disableButtons, setDisableButtons] = useState<boolean>(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(false);
  const [showTimesUpMessage, setShowTimesUpMessage] = useState<boolean>(false);
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [correctlyAnswered, setCorrectlyAnswered] = useState<boolean>(false);

  const [playCorrectSound] = useSound(correctSound);
  const [playWrongSound] = useSound(wrongSound);
  const [playTimesUpSound] = useSound(timesUpSound);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await retrieveToken();
        setToken(token);
        
        await fetchQuestion(token);
      } catch (e: any) {
        handleRequestError(e);
      }
    }

    init();
  }, [])

  const onNextClick = () => {
    setDisableButtons(false);
    fetchQuestion(token);
    resetClock();
  };

  const startTimer = () => {
    timer.resetCount();
    timer.init(onTimeUp, onTick);
  }

  const resetClock = () => {
    timer.stop();
    timer.resetCount();
    setRemainingTime(20);
  };

  const onTimeUp = async () => {
    playTimesUpSound();
    resetClock();
    
    // add to the count of incorrect answers
    incrementScore(false);

    // ...disable the answer buttons...  
    setDisableButtons(true);

    // ...and show "Times Up!" message
    setShowTimesUpMessage(true);
  };

  const onTick = () => {
    if (remainingTime > 0) {
      setRemainingTime((remainingTime) => remainingTime - 1);
    } else {
      onTimeUp();
    }
  };

  const handleRequestError = (e: any) => {
    // if we've sent too many requests over too short a perios of time...
    if (e.response?.status === 429) {
      setTimeout(() => {
        // then try again in five seconds
        fetchQuestion(token);
      }, FIVE_SECONDS)
    } else {
      console.error(`encountered request error, status code was ${e.response?.status}`);
    }
  };

  const fetchQuestion = async (token: string) => {
    try {
      setShowLoadingScreen(true);

      const question: QuestionObj = await requestQuestion(token);
      await setQuestionObj(question);

      setShowTimesUpMessage(false);
      setShowLoadingScreen(false);
      setShowTimer(true);
      
      startTimer();
    } catch (e: any) {
      handleRequestError(e);
    }
  };

  const incrementScore = (answeredCorrectly: boolean) => {
    if (answeredCorrectly) {
      setGameObj({ 
        ...gameObj,
        correctAnswers: ++gameObj.correctAnswers,
        totalQuestions: ++gameObj.totalQuestions
      })
    } else {
      setGameObj({ 
        ...gameObj,
        incorrectAnswers: ++gameObj.incorrectAnswers,
        totalQuestions: ++gameObj.totalQuestions
      })
    }
  };

  const onCorrectAnswer = () => {
    playCorrectSound();
    incrementScore(true);
    setShowTimer(false);
    setCorrectlyAnswered(true);
  };

  const onIncorrectAnswer = () => {
    playWrongSound();
    incrementScore(false);
    setShowTimer(false);
    setCorrectlyAnswered(false);
  };

  const onQuestionAnswer = (question: QuestionObj | null, choice: QuestionChoice) => {
    setDisableButtons(true);
    timer.stop();

    if (question?.incorrect_answers.includes(choice.text)) {
      onIncorrectAnswer();
    } else {
      onCorrectAnswer();
    }
  };

  return (
    <>
      {showLoadingScreen ? <>
        <Grid xs={12}>
          <h1 className={classes.loadingMsg}>Loading Next Question...</h1>
        </Grid>
      </> : <>
        <Grid 
          className={classes.questionContainer}
          
          md={6} 
          sm={12} 
          xs={12}>
          <QuestionDisplay 
            onQuestionAnswer={onQuestionAnswer} 
            questionObj={questionObj} 
            disableButtons={disableButtons}/>
        </Grid>
        <Grid 
          className={classes.scoreContainer}
          md={6} 
          sm={12} 
          xs={12}>
          <GameStats game={gameObj}></GameStats>
        </Grid>
        
        <Grid 
          alignItems="center" 
          justifyContent="center"
          xs={12} 
          className={classes.resultsContainer}>
          { showTimer ? <>
            { showTimesUpMessage ? (
              <Grid container 
                alignItems="center" 
                justifyContent="center">
                <Grid item>
                  <h2 className={ classes.resultLabel }>Times Up!</h2>
                </Grid>
              </Grid>
            ) : <h2>{remainingTime}</h2>}
          </> : <>
          <Grid container 
                alignItems="center" 
                justifyContent="center">
            { correctlyAnswered ? 
              (
                <Grid item>
                  <h2>Correct!</h2>  
                </Grid>
              ) : 
              (
                <Grid item>
                  <h2>Wrong</h2>  
                </Grid>
              )}
          </Grid>
          </>}
        </Grid>
        { !showTimer || showTimesUpMessage ? (
            <>
              <Grid container 
                alignItems="center" 
                justifyContent="center">
                <Grid item>
                  <button className={classes.nextBtn} type="button" onClick={onNextClick}>Next</button>  
                </Grid>
              </Grid> 
              <Grid container 
                alignItems="center"
                justifyContent="center">
                <Grid item>
                  <p className={ classes.correctAnswer }>
                      (Correct Answer: { questionObj?.correct_answer })
                  </p>
                </Grid>
              </Grid>
            </>
          ) : <></>}
      </>}
    </>
  )
}

const GameBoard = withStyles(styles)(GameBoardBase);
export { GameBoard };