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

export interface Game {
  incorrectAnswers: number;
  correctAnswers: number;
  totalQuestions: number;
}

const GameBoard = () => {
  const FIVE_SECONDS = 5000;
  const [gameObj, setGameObj] = useState<Game>({
    incorrectAnswers: 0,
    correctAnswers: 0,
    totalQuestions: 0,
  });
  const [questionObj, setQuestionObj] = useState<QuestionObj | null>(null)
  const [token, setToken] = useState('');
  const [remainingTime, setRemainingTime] = useState<number>(20);
  const [showNextBtn, setShowNextBtn] = useState<boolean>(false);
  const [disableButtons, setDisableButtons] = useState<boolean>(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(false);
  
  const [playCorrectSound] = useSound(correctSound);
  const [playWrongSound] = useSound(wrongSound);
  const [playTimesUpSound] = useSound(timesUpSound);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await retrieveToken();
        setToken(token);
        
        timer.init(onTimeUp, onTick)
        
        await fetchQuestion(token);
      } catch (e: any) {
        handleRequestError(e);
      }
    }

    init();
  }, [])

  const onNextClick = () => {
    setShowNextBtn(false);
    setDisableButtons(false);
    fetchQuestion(token);
    resetClock();
    startTimer();
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

    // ...and display the next button
    setShowNextBtn(true);
  };

  const onTick = () => {
    console.log("tick");
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

      const question = await requestQuestion(token);
      await setQuestionObj(question);

      setShowLoadingScreen(false);
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
  };

  const onIncorrectAnswer = () => {
    playWrongSound();
    incrementScore(false);
  };

  const onQuestionAnswer = (question: QuestionObj | null, choice: QuestionChoice) => {
    setDisableButtons(true);
    timer.stop();
    setShowNextBtn(true);

    if (question?.incorrect_answers.includes(choice.text)) {
      onIncorrectAnswer();
    } else {
      onCorrectAnswer();
    }
  };

  return (
    <>
      {showLoadingScreen ? <>
        <h1>Loading Next Question...</h1>
      </> : <>
        <QuestionDisplay 
          onQuestionAnswer={onQuestionAnswer} 
          questionObj={questionObj} 
          disableButtons={disableButtons}/>
        <GameStats game={gameObj}></GameStats>
        <h1>{remainingTime}</h1>
        {showNextBtn ? <button type="button" onClick={onNextClick}>Next</button> : <></>}
      </>}
    </>
  )
}

export { GameBoard };