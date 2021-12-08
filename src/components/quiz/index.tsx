/**
 * Main quiz component that contains the question card
 */

import { Button, Stack, VStack } from "@chakra-ui/react";
import * as React from "react";
import { FaRegArrowAltCircleRight, FaRegTimesCircle } from "react-icons/fa";
import { QuizContext } from "../../contexts/QuizContext";
import QuestionCard from "../question-card";

const Quiz: React.FC = () => {
  const {
    questionNumber,
    setQuestionNumber,
    questions,
    setReviewQuestions,
    setScore,
    status,
    setStatus,
    totalQuestions,
    userAnswers,
    setUserAnswers,
  } = React.useContext(QuizContext);

  const checkAnswer = (e: any) => {
    if (status !== "result") {
      const selectedAnswer = e.currentTarget.value;
      const isCorrect =
        questions[questionNumber].correct_answer === selectedAnswer;
      // If selected answer is correct, increment score by 1
      if (isCorrect) setScore((prevState: number) => prevState + 1);
      const answerObject = {
        question: questions[questionNumber].question,
        selectedAnswer,
        isCorrect,
        correctAnswer: questions[questionNumber].correct_answer,
      };
      const reviewObject = {
        question: questions[questionNumber].question,
        selectedAnswer,
        correctAnswer: questions[questionNumber].correct_answer,
      };
      setUserAnswers((prevState: any) => [...prevState, answerObject]);
      // If selected answer is incorrect, save it to be reviewed later
      if (!isCorrect)
        setReviewQuestions((prevState: any) => [...prevState, reviewObject]);
    }
  };

  const cancelQuiz = () => {
    const colorMode = localStorage.getItem("chakra-ui-color-mode") || "";
    window.localStorage.clear();
    window.localStorage.setItem("chakra-ui-color-mode", colorMode);
    setStatus("setup");
  };

  const finishQuiz = () => {
    const colorMode = window.localStorage.getItem("chakra-ui-color-mode") || "";
    const score = window.localStorage.getItem("score") || "";
    const total = window.localStorage.getItem("total-questions") || "5";
    const reviewQuestions =
      window.localStorage.getItem("review-questions") || "";
    localStorage.clear();
    localStorage.setItem("chakra-ui-color-mode", colorMode);
    localStorage.setItem("score", score);
    localStorage.setItem("total-questions", total);
    localStorage.setItem("review-questions", reviewQuestions);
    setStatus("result");
  };

  return (
    <VStack spacing="40px" maxW="800px" w="100%">
      <QuestionCard
        question={questions[questionNumber].question}
        answers={questions[questionNumber].answers}
        userAnswer={userAnswers ? userAnswers[questionNumber] : undefined}
        callback={checkAnswer}
        questionNumber={questionNumber + 1}
        totalQuestions={totalQuestions}
      />
      <Stack
        direction={["column", "row"]}
        spacing="8px"
        w="100%"
        justify="flex-end"
      >
        <Button
          colorScheme="red"
          onClick={cancelQuiz}
          leftIcon={<FaRegTimesCircle />}
        >
          Cancel Quiz
        </Button>
        {/* If there is a next question, display next button, otherwise, display finish button */}
        {questionNumber + 1 >= totalQuestions ? (
          <Button
            colorScheme="teal"
            onClick={finishQuiz}
            isDisabled={userAnswers.length !== totalQuestions}
          >
            Finish Quiz
          </Button>
        ) : (
          <Button
            colorScheme="teal"
            onClick={() => setQuestionNumber(questionNumber + 1)}
            isDisabled={userAnswers.length <= questionNumber}
            rightIcon={<FaRegArrowAltCircleRight />}
          >
            Next Question
          </Button>
        )}
      </Stack>
    </VStack>
  );
};

export default Quiz;
