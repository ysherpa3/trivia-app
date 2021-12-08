/**
 * Number input component for total questions to generate
 */

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import * as React from "react";

interface TotalQuestionsProps {
  totalQuestions: number;
  setTotalQuestions: React.Dispatch<React.SetStateAction<number>>;
}

const TotalQuestionsInput: React.FC<TotalQuestionsProps> = ({
  totalQuestions,
  setTotalQuestions,
}) => {
  return (
    <FormControl id="totalQuestions" isInvalid={totalQuestions <= 0}>
      <FormLabel>Number of Questions</FormLabel>
      <NumberInput
        min={1}
        value={totalQuestions}
        onChange={(e, newValue) => setTotalQuestions(newValue)}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <FormErrorMessage>
        {totalQuestions <= 0 &&
          "Please pick a number greater than or equal to 1"}
      </FormErrorMessage>
    </FormControl>
  );
};

export default TotalQuestionsInput;
