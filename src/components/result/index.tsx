/**
 * Result page that shows total score and missed questions
 */

import {
  Button,
  CircularProgress,
  CircularProgressLabel,
  Heading,
  HStack,
  Icon,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import {
  FaCheckCircle,
  FaQuestion,
  FaRedoAlt,
  FaTimesCircle,
} from "react-icons/fa";
import { QuizContext } from "../../contexts/QuizContext";

const Result: React.FC = () => {
  const { setStatus, totalQuestions, reviewQuestions } =
    React.useContext(QuizContext);

  const restartQuiz = () => {
    const colorMode = localStorage.getItem("chakra-ui-color-mode") || "";
    localStorage.clear();
    localStorage.setItem("chakra-ui-color-mode", colorMode);
    setStatus("setup");
  };

  const score = window.localStorage.getItem("score") || "";

  const calcPercent = (score: number, total: number) => (score * 100) / total;

  const scoreColor = (value: number) => {
    if (value <= 40) {
      return "red.500";
    } else if (value > 40 && value <= 80) {
      return "orange.500";
    } else return "green.500";
  };

  return (
    <VStack spacing="40px" py="40px">
      <Heading as="h1">Quiz Result</Heading>
      <CircularProgress
        value={calcPercent(parseInt(score), totalQuestions)}
        color={scoreColor(calcPercent(parseInt(score), totalQuestions))}
        size="160px"
      >
        <CircularProgressLabel>
          <Text
            fontSize="3xl"
            color={scoreColor(calcPercent(parseInt(score), totalQuestions))}
          >
            {calcPercent(parseInt(score), totalQuestions)}%
          </Text>
          <Text fontSize="xl">
            {score}/{totalQuestions}
          </Text>
        </CircularProgressLabel>
      </CircularProgress>
      <Button colorScheme="teal" onClick={restartQuiz} leftIcon={<FaRedoAlt />}>
        Take Another Quiz
      </Button>
      {reviewQuestions.length > 0 ? (
        <Stack spacing="40px">
          <Heading as="h2">Review</Heading>
          <Stack spacing="40px">
            {reviewQuestions.map((item, index) => (
              <Stack key={index}>
                <HStack align="center">
                  <Icon
                    as={FaQuestion}
                    bg="linear-gradient(to left, #11998e, #38ef7d)"
                    w={6}
                    h={6}
                    p="4px"
                    borderRadius="4px"
                  />
                  <Text dangerouslySetInnerHTML={{ __html: item.question }} />
                </HStack>
                <List spacing="8px">
                  <ListItem
                    bg="linear-gradient(to right, #cb2d3e, #ef473a)"
                    p="8px"
                    borderRadius="4px"
                  >
                    <ListIcon as={FaTimesCircle} />{" "}
                    <Text
                      as="span"
                      dangerouslySetInnerHTML={{ __html: item.selectedAnswer }}
                    />
                  </ListItem>
                  <ListItem
                    bg="linear-gradient(to right, #11998e, #38ef7d)"
                    p="8px"
                    borderRadius="4px"
                  >
                    <ListIcon as={FaCheckCircle} />{" "}
                    <Text
                      as="span"
                      dangerouslySetInnerHTML={{ __html: item.correctAnswer }}
                    />
                  </ListItem>
                </List>
              </Stack>
            ))}
          </Stack>
        </Stack>
      ) : (
        <Text>Awesome, you answered all questions correctly</Text>
      )}
    </VStack>
  );
};

export default Result;
