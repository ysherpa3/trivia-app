/**
 * Select component for quiz category input
 */

import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import axios from "axios";
import * as React from "react";

interface CategoryProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

const CategoryInput: React.FC<CategoryProps> = ({ category, setCategory }) => {
  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    axios
      .get("https://opentdb.com/api_category.php")
      .then((response) => setCategories(response.data.trivia_categories))
      .catch((error) => console.log(error));
  }, []);

  return (
    <FormControl id="category">
      <FormLabel>Select Category</FormLabel>
      <Select
        placeholder="Any Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategoryInput;
