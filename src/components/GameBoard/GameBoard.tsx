import React, { useEffect, useState } from "react";
import { AppHeader } from "../AppHeader/AppHeader";
import { QuestionChoice, QuestionDisplay } from "../QuestionDisplay";
import { QuestionObj, requestQuestion } from "../../services/questionService";

export interface Game {
  incorrectAnswers: number;
  correctAnswers: number;
  totalQuestions: number;
}

interface Props {
  token: string
}

const GameBoard = (props: Props) => {
  const [gameObj, setGameObj] = useState<Game>({
    incorrectAnswers: 0,
    correctAnswers: 0,
    totalQuestions: 0,
  });
  const [questionObj, setQuestionObj] = useState<QuestionObj | null>(null)
  const [questionRequested, setQuestionRequested] = useState<boolean>(false);

  const { token } = props;

  useEffect(() => {
    fetchQuestion();
  }, [token])

  const fetchQuestion = async () => {
    if (token && !questionRequested) {
      const question = await requestQuestion(token);
      setQuestionRequested(true);
      setQuestionObj(question);
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
        incorrectAnswers: ++gameObj.correctAnswers,
        totalQuestions: ++gameObj.totalQuestions
      })
    }
  };

  const onCorrectAnswer = () => {
    console.log('Correct');
    incrementScore(true);
  };

  const onIncorrectAnswer = () => {
    console.log('Incorrect');
    incrementScore(false);
  };

  const onQuestionAnswer = (question: QuestionObj | null, choice: QuestionChoice) => {
    if (question?.incorrect_answers.includes(choice.text)) {
      onIncorrectAnswer();
    } else {
      onCorrectAnswer();
    }
  };

  return (
    <>
      <AppHeader></AppHeader>
      <QuestionDisplay onQuestionAnswer={onQuestionAnswer} questionObj={questionObj}></QuestionDisplay>
    </>
  )
}

export { GameBoard };