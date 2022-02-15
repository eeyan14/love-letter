import React, { useState } from "react";
import styled from "styled-components";
import CharacterCard from "components/CharacterCard";
import { Card, Player, MAX_IN_HAND } from "helpers/types";

import { styleVariables, AppSection } from "helpers/styles";

type PlayerProps = {
  deck: Card[];
  deckRef: HTMLElement | null;
  player: Player;
};

const CardRow = styled("div")<{ numCards: number }>`
  position: relative;
  display: flex;
  margin: 0 auto;

  ${(props) =>
    `width: calc((${props.numCards} * ${styleVariables.cardWidthL}) +
   ((${props.numCards} - 1) * ${styleVariables.baseSpacing}));`}
`;

const PlayerHand = ({ deck, deckRef, player }: PlayerProps) => {
  // const { hand } = player;
  const [hand, setHand] = useState<Array<Card>>(player.hand);
  const hiddenCardCount = Array.from(Array(MAX_IN_HAND - hand.length).keys());

  const handleDraw = () => {
    if (hand.length === 1) {
      setHand([deck[deck.length - 1], ...hand]);
    } else {
      setHand([hand[1]]);
    }
  };

  return (
    <AppSection sectionType="player">
      <CardRow numCards={hand.length}>
        {hiddenCardCount.map((num) => {
          return (
            <CharacterCard
              key={num}
              character={Card[deck[deck.length - 1 - num]]}
              deckRef={deckRef}
              hideCard={true}
              size="l"
              showCharacter={true}
            />
          );
        })}

        {hand.map((card, i) => {
          console.log("hand...", Card[card]);
          return (
            <CharacterCard
              key={i}
              character={Card[card]}
              rowIndex={i + 1}
              size="l"
              showCharacter={true}
            />
          );
        })}
        {/*<CharacterCard
          character={Card[deck[deck.length - 1]]}
          deckRef={deckRef}
          hideCard={hideCard}
          size="l"
          showCharacter={true}
        />

        <CharacterCard
          character={Card[hand[0]]}
          size="l"
          showCharacter={true}
        />*/}
        <button
          onClick={handleDraw}
          style={{ position: "absolute", right: "-20px" }}
        >
          Draw
        </button>
      </CardRow>
    </AppSection>
  );
};

export default PlayerHand;
