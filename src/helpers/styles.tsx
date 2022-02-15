import styled, { css } from "styled-components";

export const styleVariables = {
  cardHeightMultiplier: 1.4,

  // the following widths are in px
  cardWidthXS: "100px",
  cardWidthS: "150px",
  cardWidthM: "200px",
  cardWidthL: "250px",
  cardWidthXL: "300px",

  baseSpacing: "16px",
  fontCursive: '"Dancing Script", cursive',
};

export const TextStandard = styled("p")<{ fontSize?: string }>`
  ${(props) => `font-size: ${props.fontSize || "0.8rem"};`}
  font-family: "Poppins", sans-serif;
  margin: 0;
  margin-bottom: calc(${styleVariables.baseSpacing} / 2);
  padding: 0;
`;

export const TextMedieval = styled(TextStandard)<{ fontSize?: string }>`
  ${(props) => `font-size: ${props.fontSize || "1.2rem"};`}
  font-family: "UnifrakturMaguntia", cursive;
`;

export const TextMedievalSpan = styled(TextMedieval)``;

export const AppSection = styled("section")<{ sectionType?: string }>`
  display: flex;
  margin: ${styleVariables.baseSpacing} calc(${styleVariables.baseSpacing} * 2);
  box-sizing: border-box;

  ${(props) => {
    if (props.sectionType === "player") {
      return css`
        justify-content: flex-end;
      `;
    } else if (props.sectionType === "deck") {
      return css`
        min-height: calc(
          ${styleVariables.cardWidthS} + ${styleVariables.baseSpacing} * 5
        );
        flex-direction: column;
      `;
    }
  }}
`;
