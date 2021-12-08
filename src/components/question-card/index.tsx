/**
 * Question card component
 */

import { Stack, Text } from "@chakra-ui/react";
import * as React from "react";
import { Answer } from "../../api/fetchData";
import { ButtonWrapper } from "./styles";

interface Props {
  answers: string[];
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  question: string;
  questionNumber: number;
  totalQuestions: number;
  userAnswer: Answer | undefined;
}

const QuestionCard: React.FC<Props> = ({
  answers,
  callback,
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
}) => {
  return (
    <Stack maxW="500px" w="100%">
      <Text pb="40px">
        Question: {questionNumber} / {totalQuestions}
      </Text>
      <Text dangerouslySetInnerHTML={{ __html: question }} pb="20px" />
      <Stack>
        {answers.map((answer) => (
          <ButtonWrapper
            key={answer}
            isCorrect={userAnswer?.correctAnswer === answer}
            hasClicked={userAnswer?.selectedAnswer === answer}
          >
            <button
              disabled={userAnswer ? true : false}
              value={answer}
              onClick={callback}
            >
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </button>
          </ButtonWrapper>
        ))}
      </Stack>
    </Stack>
  );
};

export default QuestionCard;
