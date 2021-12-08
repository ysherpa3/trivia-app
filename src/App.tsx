/**
 * Main app component
 */

import {
  ChakraProvider,
  Flex,
  Heading,
  theme,
  useMediaQuery,
} from "@chakra-ui/react";
import * as React from "react";
import { Answer, Questions } from "./api/fetchData";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Quiz from "./components/quiz";
import Result from "./components/result";
import Setup from "./components/setup";
import { QuizContext, Review } from "./contexts/QuizContext";
import useLocalStorage from "./hooks/useLocalStorage";

const App: React.FC = () => {
  const [totalQuestions, setTotalQuestions] = useLocalStorage(
    "total-questions",
    5
  );
  const [category, setCategory] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("");
  const [questions, setQuestions] = useLocalStorage<Questions[]>(
    "questions",
    []
  );
  const [userAnswers, setUserAnswers] = useLocalStorage<Answer[]>(
    "user-answers",
    []
  );
  const [questionNumber, setQuestionNumber] = useLocalStorage(
    "question-number",
    0
  );
  const [score, setScore] = useLocalStorage("score", 0);
  const [status, setStatus] = useLocalStorage("status", "setup");
  const [reviewQuestions, setReviewQuestions] = useLocalStorage<Review[]>(
    "review-questions",
    []
  );

  const [isLargerThan480] = useMediaQuery("(min-width: 480px)");

  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" justify="space-between" w="100%" minH="100vh">
        <Flex justify="space-between" align="center" w="100%">
          <Heading size={isLargerThan480 ? "xl" : "lg"} px="8px">
            React Trivia API Quiz
          </Heading>
          <ColorModeSwitcher />
        </Flex>
        <Flex justify="center" align="center">
          <QuizContext.Provider
            value={{
              category,
              setCategory,
              difficulty,
              setDifficulty,
              questionNumber,
              setQuestionNumber,
              questions,
              setQuestions,
              reviewQuestions,
              setReviewQuestions,
              score,
              setScore,
              status,
              setStatus,
              totalQuestions,
              setTotalQuestions,
              userAnswers,
              setUserAnswers,
            }}
          >
            <Flex justify="center" align="center" maxW="500px" w="100%">
              {status === "setup" && <Setup />}
              {status === "quiz" && <Quiz />}
              {status === "result" && <Result />}
            </Flex>
          </QuizContext.Provider>
        </Flex>
        <Flex maxH="150px" grow={1} />
      </Flex>
    </ChakraProvider>
  );
};

export default App;
