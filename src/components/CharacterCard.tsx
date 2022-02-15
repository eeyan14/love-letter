import React from "react";
import styled, { css } from "styled-components";
import assets from "assets";
import { CardDescriptions } from "helpers/types";
import {
  styleVariables,
  TextStandard,
  TextMedieval,
  TextMedievalSpan,
} from "helpers/styles";

type CardProps = {
  character: string; // one of the characters, "Reference", "Hidden", or "Blank"
  deckRef?: HTMLElement | null;
  hideCard?: boolean; // if true, hides card (sets display: none)
  rowIndex?: number; // if this prop is present and hideCard is false/undefined, use for absolute positioning in a CardRow
  size: string; // xs, s, m, l, xl; rendered size of card
  showCharacter: boolean; // if true, shows character (front of card)
};

const CardContainer = styled.div`
  margin-bottom: ${styleVariables.baseSpacing};
  box-sizing: border-box;
`;

const StyledCard = styled("div")<{
  character: string;
  hidden: boolean;
  offSetLeft: number;
  offsetTop: number;
  rowIndex?: number;
  showCharacter: boolean;
  size: string;
}>`
  display: flex;
  position: relative;
  background: #f4de9f;
  border-radius: ${styleVariables.baseSpacing};
  margin: 0 4px;
  transition: width 0.6s, height 0.6s, transform 0.6s;
  transform-style: preserve-3d;
  border: 1px solid #617798;
  opacity: 1;
  visibility: visible;
  z-index: 0;

  ${(props) => {
    if (props.character === "blank") {
      return css`
        background: transparent;
      `;
    }
  }}

  ${(props) => {
    if (!props.showCharacter) {
      return css`
        transform: rotateY(180deg);
      `;
    }
  }}

  ${(props) => {
    if (props.size === "xs") {
      return css`
        width: ${styleVariables.cardWidthXS};
        height: calc(
          ${styleVariables.cardHeightMultiplier} * ${styleVariables.cardWidthXS}
        );
      `;
    } else if (props.size === "s") {
      return css`
        width: ${styleVariables.cardWidthS};
        height: calc(
          ${styleVariables.cardHeightMultiplier} * ${styleVariables.cardWidthS}
        );
      `;
    } else if (props.size === "m") {
      return css`
        width: ${styleVariables.cardWidthM};
        height: calc(
          ${styleVariables.cardHeightMultiplier} * ${styleVariables.cardWidthM}
        );
      `;
    } else if (props.size === "l") {
      return css`
        width: ${styleVariables.cardWidthL};
        height: calc(
          ${styleVariables.cardHeightMultiplier} * ${styleVariables.cardWidthL}
        );
      `;
    } else if (props.size === "xl") {
      return css`
        width: ${styleVariables.cardWidthXL};
        height: calc(
          ${styleVariables.cardHeightMultiplier} * ${styleVariables.cardWidthXL}
        );
      `;
    }
  }}

  ${(props) => {
    // absolute positioning for "hidden" cards and cards in a player's hand
    // this needs to be below the size check so that it overrides the card size
    if (props.hidden) {
      if (!!props.offSetLeft && !!props.offsetTop) {
        return css`
          position: fixed;
          left: ${props.offSetLeft}px;
          top: ${props.offsetTop}px;
          width: ${styleVariables.cardWidthS};
          height: calc(
            ${styleVariables.cardHeightMultiplier} *
              ${styleVariables.cardWidthS}
          );
        `;
      } else {
        return css`
          position: fixed;
          display: none;
        `;
      }
    } else if (!props.hidden && !!props.rowIndex) {
      if (props.size === "xs") {
        return css`
          position: absolute;
          left: calc(
            ((${props.rowIndex} - 1) * ${styleVariables.cardWidthXS}) +
              ((${props.rowIndex} - 1) * ${styleVariables.baseSpacing})
          );
        `;
      } else if (props.size === "l") {
        return css`
          position: absolute;
          left: calc(
            ((${props.rowIndex} - 1) * ${styleVariables.cardWidthL}) +
              ((${props.rowIndex} - 1) * ${styleVariables.baseSpacing})
          );
        `;
      }
    }
  }}
`;

const CardFront = styled("div")<{ hidden?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
`;

const CardBack = styled(CardFront)`
  align-items: center;
  transform: rotateY(180deg);
`;

const CardFrontContent = styled.div<{ size: string }>`
  ${(props) => {
    if (["xs", "s", "m"].includes(props.size)) {
      return css`
        padding: ${styleVariables.baseSpacing};
      `;
    } else {
      return css`
        padding: calc(${styleVariables.baseSpacing} * 1.5);
      `;
    }
  }}
`;

const CardFrontHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: ${styleVariables.baseSpacing};
`;

const CardBackLogo = styled.img`
  width: 70%;
  height: auto;
  margin: auto;
`;

const PointContainer = styled.div`
  position: relative;
  margin-right: ${styleVariables.baseSpacing};
`;

const PointContainerImg = styled("img")<{ size: string }>`
  ${(props) => {
    if (["xs", "s", "m"].includes(props.size)) {
      return css`
        width: 30px;
      `;
    } else {
      return css`
        width: 50px;
      `;
    }
  }}
  height: auto;
`;

const PointContainerText = styled(TextMedieval)<{ size: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  margin: 0;

  ${(props) => {
    if (["xs", "s", "m"].includes(props.size)) {
      return css`
        font-size: 0.6rem;
      `;
    }
  }}
`;

const CharacterBorder = styled("div")<{ color: string }>`
  ${(props) => `background: ${props.color};`}
  position: absolute;
  bottom: 0;
  width: 100%;
  height: calc(${styleVariables.baseSpacing} * 2);
  border-radius: 0 0 ${styleVariables.baseSpacing} ${styleVariables.baseSpacing};
`;

const CharacterCard = ({
  character,
  deckRef,
  hideCard,
  rowIndex,
  size,
  showCharacter,
}: CardProps) => {
  const specialCards = ["Reference", "Blank"];

  let offSetLeft = 0;
  let offsetTop = 0;
  if (hideCard && deckRef) {
    const deckRefBoundingClientRect = deckRef.getBoundingClientRect();
    console.log("getBoundingClientRect", deckRefBoundingClientRect);
    offSetLeft = deckRefBoundingClientRect.left;
    offsetTop = deckRefBoundingClientRect.top;
  }

  return (
    <CardContainer className="card-container">
      <StyledCard
        character={character.toLowerCase()}
        hidden={!!hideCard}
        offSetLeft={offSetLeft}
        offsetTop={offsetTop}
        rowIndex={rowIndex}
        showCharacter={showCharacter}
        size={size}
      >
        <CardBack>
          <CardBackLogo
            src={assets.waxSealLogo}
            alt="Back of card"
            className="card-back-img"
          />
        </CardBack>

        {character === "Reference" && (
          <CardFront>
            <CardFrontContent size={size}>
              {Object.keys(CardDescriptions).map((key, i) => {
                return (
                  <TextStandard key={i}>
                    <TextMedievalSpan>
                      {CardDescriptions[key].points}–{key}
                    </TextMedievalSpan>{" "}
                    <span className="small">(x1):</span>{" "}
                    {CardDescriptions[key].reference}
                  </TextStandard>
                );
              })}
            </CardFrontContent>
          </CardFront>
        )}

        {character === "Blank" && <CardFront />}

        {hideCard && (
          <CardFront hidden>
            <CardBackLogo
              src={assets.waxSealLogo}
              alt="Back of card"
              className="card-back-img"
            />
          </CardFront>
        )}

        {!specialCards.includes(character) && !hideCard && (
          <CardFront>
            <CardFrontContent size={size}>
              <CardFrontHeader>
                <PointContainer>
                  <PointContainerImg src={assets.waxSealBlack} size={size} />
                  <PointContainerText size={size}>
                    {CardDescriptions[character].points}
                  </PointContainerText>
                </PointContainer>

                <TextMedieval fontSize="2rem">{character}</TextMedieval>
              </CardFrontHeader>

              {["l", "xl"].includes(size) && (
                <TextStandard>{CardDescriptions[character].card}</TextStandard>
              )}
            </CardFrontContent>

            <CharacterBorder color={CardDescriptions[character].color} />
          </CardFront>
        )}
      </StyledCard>
    </CardContainer>
  );
};

export default CharacterCard;
