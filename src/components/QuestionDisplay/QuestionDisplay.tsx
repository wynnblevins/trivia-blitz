import React, { useEffect, useState } from "react";
import { QuestionObj } from "../../services/questionService";
import { WithStyles, withStyles, createStyles } from "@material-ui/core";
import { shuffle } from "../../services/shuffleService";

interface Props extends WithStyles {};

let LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F'
]

const styles = {
  questionChoices: {
    listStyleType: 'none'
  }
}

interface Props {
  questionObj: QuestionObj | null;
  onQuestionAnswer: (question: QuestionObj | null, choice: QuestionChoice) => void
}

export interface QuestionChoice {  
  letter: string,
  text: string
}

const QuestionDisplayBase = (props: Props) => {
  const { questionObj, onQuestionAnswer, classes } = props;
  
  const [questionChoices, setQuestionChoices] = useState<QuestionChoice[]>([]);
  const [questionText, setQuestionText] = useState<string>()

  useEffect(() => {
    if (questionObj) {
      setQuestionText(questionObj.question)
      
      // create a shuffled array of possible choices
      const questionChoices: QuestionChoice[] = []
      const choices = [...questionObj.incorrect_answers, questionObj.correct_answer];
      const shuffledChoices = shuffle(choices);

      for (let i = 0; i < shuffledChoices.length; i++) {
        const choice: QuestionChoice = {
          letter: LETTERS[i],
          text: choices[i]
        }
        questionChoices.push(choice);
      }
      
      setQuestionChoices(questionChoices)
    }
  }, [questionObj])

  return <>
    <p>{questionText}</p>
    <div className={classes.questionChoices}>
      {questionChoices.map((possibleAnswer: QuestionChoice) => {
        return (
          <div>
            <button onClick={() => onQuestionAnswer(questionObj, possibleAnswer)}>
                {possibleAnswer.letter}
            </button>: <span>{possibleAnswer.text}</span>
          </div>
        )
      })}
    </div>
  </>
};

const QuestionDisplay = withStyles(styles)(QuestionDisplayBase);

export { QuestionDisplay }