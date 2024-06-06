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
    listStyleType: 'none',
    margin: "0 auto",
    width: "85%"
  },
  questionBox: {
    marginBottom: "20px"
  },
  questionText: {
    width: "85%",
    marginBottom: "20px",
    marginLeft: "20px",
    marginRight: "20px"
  },
  possibleAnswer: {
    marginLeft: '10px'
  }
}

interface Props {
  questionObj: QuestionObj | null;
  onQuestionAnswer: (question: QuestionObj | null, choice: QuestionChoice) => void;
  disableButtons: boolean;
}

export interface QuestionChoice {  
  letter: string,
  text: string
}

const QuestionDisplayBase = (props: Props) => {
  const { questionObj, classes, onQuestionAnswer, disableButtons } = props;
  
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

  return (
    <div className={classes.questionBox}>
      <h3 className={classes.questionText} dangerouslySetInnerHTML={{ __html: questionText as string | TrustedHTML }} />
      <div className={classes.questionChoices}>
        {questionChoices.map((possibleAnswer: QuestionChoice) => {
          return (
            <div style={{ marginRight: "25%" }}>
              <button disabled={disableButtons} onClick={() => onQuestionAnswer(questionObj, possibleAnswer)}>
                  {possibleAnswer.letter}
              </button>
              <span className={classes.possibleAnswer}>{possibleAnswer.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
};

const QuestionDisplay = withStyles(styles)(QuestionDisplayBase);

export { QuestionDisplay }