/**
 * Quiz setup component
 */

import {
  Button,
  Center,
  Icon,
  Link,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { fetchQuestions } from "../../api/fetchData";
import { QuizContext } from "../../contexts/QuizContext";
import CategoryInput from "./CategoryInput";
import DifficultyInput from "./DifficultyInput";
import TotalQuestionsInput from "./TotalQuestionsInput";

const Setup: React.FC = () => {
  const {
    setStatus,
    totalQuestions,
    setTotalQuestions,
    difficulty,
    setDifficulty,
    category,
    setCategory,
    setQuestions,
    setScore,
    setQuestionNumber,
  } = React.useContext(QuizContext);

  const startQuiz = async () => {
    const questionsList = await fetchQuestions(
      totalQuestions,
      category,
      difficulty
    );
    setQuestions(questionsList);
    setScore(0);
    setQuestionNumber(0);
    setStatus("quiz");
  };

  const linkColor = useColorModeValue("teal.600", "teal.400");

  return (
    <Center w="100%">
      <VStack spacing="40px" w="100%">
        <Text align="center" lineHeight="30px">
          Trivia game built using React, Chakra-UI, and questions retrieved from
          the{" "}
          <Link
            href="https://opentdb.com/"
            color={linkColor}
            textUnderlineOffset="0.2em"
            isExternal
          >
            Open Trivia Database{" "}
            <sup>
              <Icon w={4} h={4} as={FaExternalLinkAlt} />
            </sup>
          </Link>
        </Text>
        <TotalQuestionsInput
          totalQuestions={totalQuestions}
          setTotalQuestions={setTotalQuestions}
        />
        <CategoryInput category={category} setCategory={setCategory} />
        <DifficultyInput
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />
        <Button colorScheme="teal" onClick={startQuiz} maxW={200} isFullWidth>
          Start
        </Button>
      </VStack>
    </Center>
  );
};

export default Setup;
