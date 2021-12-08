/**
 * Select component for question difficulty input
 */

import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import * as React from "react";

const difficulties = ["Easy", "Medium", "Hard"];

interface DifficultyProps {
  difficulty: string;
  setDifficulty: React.Dispatch<React.SetStateAction<string>>;
}

const DifficultyInput: React.FC<DifficultyProps> = ({
  difficulty,
  setDifficulty,
}) => {
  return (
    <FormControl id="difficulty">
      <FormLabel>Select Difficulty</FormLabel>
      <Select
        placeholder="Any Difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        {difficulties.map((item, index) => (
          <option key={index} value={item.toLowerCase()}>
            {item}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default DifficultyInput;
