import React, { useState } from "react";
import styled, { css } from "styled-components";
import CharacterCard from "components/CharacterCard";
import { Card } from "helpers/types";
import { AppSection, TextStandard } from "helpers/styles";
import "App.css";

const CardInDeck = styled("div")<{ offsetTop: number }>`
  position: absolute;
  left: 0;
  top: 0;
  padding: inherit;
  border: none;
  outline: none;
  font: inherit;
  color: inherit;
  background: none;
  ${(props) => `top: ${props.offsetTop}px;`}
`;

type DeckProps = {
  deck: Card[];
  deckType: string; // "deck", "discard"
};

const Deck = ({ deck, deckType }: DeckProps) => {
  const offset = 3; // px

  const showCards = deckType === "discard";
  const [showTopCard, setShowTopCard] = useState<boolean>(false);

  const handleDraw = () => {
    // TODO
    setShowTopCard(!showTopCard);
  };

  const renderCards = () => {
    if (deck.length === 0) {
      return (
        <CardInDeck offsetTop={0}>
          <CharacterCard character="Blank" size="s" showCharacter={showCards} />
        </CardInDeck>
      );
    }

    return deck.map((card, i) => {
      const offsetTop = offset * (deck.length - i);
      if (i + 1 === deck.length && deckType === "deck") {
        // this is the top card and can be drawn, render it as a button
        return (
          <CardInDeck key={i} onClick={handleDraw} offsetTop={offsetTop}>
            <CharacterCard
              character={Card[card]}
              size="s"
              showCharacter={showTopCard}
            />
          </CardInDeck>
        );
      } else {
        return (
          <CardInDeck offsetTop={offsetTop} key={i}>
            <CharacterCard
              character={Card[card]}
              size="s"
              showCharacter={showCards}
            />
          </CardInDeck>
        );
      }
    });
  };

  return (
    <AppSection id={`deck-${deckType}`} sectionType="deck">
      <TextStandard>{deckType === "discard" ? "Discard" : "Deck"}</TextStandard>

      <div
        id={`deck-${deckType}-container`}
        style={{ position: "relative", width: "100%" }}
      >
        {renderCards()}
      </div>
    </AppSection>
  );
};

export default Deck;
