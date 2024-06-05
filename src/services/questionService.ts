import axios from "axios";

enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard"
}

enum QuestionType {
  multiple = "Multiple",
  trueFalse = "Boolean"
}

export interface QuestionObj {
  category: string;
  correct_answer: string;
  incorrect_answers: string[];
  difficulty: Difficulty;
  question: string;
  type: QuestionType;
}

export const requestQuestion = async (sessionToken: string): Promise<QuestionObj> => {
    const requestUrl = `https://opentdb.com/api.php?amount=1&token=${sessionToken}`
    const questionResponse = await axios.get(requestUrl);
    return questionResponse?.data?.results[0];
};