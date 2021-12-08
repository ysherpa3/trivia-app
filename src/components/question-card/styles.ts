/**
 * Question card styles
 */

import styled from "@emotion/styled";

type ButtonWrapperProps = {
  isCorrect: boolean;
  hasClicked: boolean;
};

export const ButtonWrapper = styled.div<ButtonWrapperProps>`
  transition: all 0.3s ease;

  button {
    cursor: pointer;
    user-select: none;
    font-size: 0.85rem;
    width: 100%;
    min-height: 40px;
    margin: 5px 0;
    background: ${({ isCorrect, hasClicked }) =>
      isCorrect
        ? "linear-gradient(to right, #11998e, #38ef7d)"
        : !isCorrect && hasClicked
        ? "linear-gradient(to right, #cb2d3e, #ef473a)"
        : "linear-gradient(to right, #373b44, #4286f4)"};
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    border-radius: 5px;
    color: #fff;

    :disabled {
      cursor: not-allowed;
    }
  }
`;
