import React, { useState } from "react";
import CharacterCard from "./CharacterCard";
import { Card } from "../helpers/types";
import "App.css";
import "components/Card.css";

type DeckProps = {
  deck: Card[];
};

const Deck = ({ deck }: DeckProps) => {
  const offset = 3; // px
  const cardStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    padding: "inherit",
    border: "none",
    outline: "none",
    font: "inherit",
    color: "inherit",
    background: "none",
  };

  const [showTopCard, setShowTopCard] = useState<boolean>(false);

  return (
    <section className="deck">
      <p>Deck</p>

      <div
        className="deck-container"
        style={{ position: "relative", width: "100%" }}
      >
        {deck.map((card, i) => {
          const thisCardStyle: React.CSSProperties = {
            ...cardStyle,
            top: offset * (deck.length - i),
          };

          if (i + 1 === deck.length) {
            // this is the last card, render it as a button
            return (
              <button
                key={i}
                className="card-in-deck"
                style={thisCardStyle}
                onClick={() => setShowTopCard(!showTopCard)}
              >
                <CharacterCard
                  character={Card[card]}
                  size="s"
                  shown={showTopCard}
                  hideDescription={true}
                />
              </button>
            );
          } else {
            console.log(i, cardStyle.top);
            return (
              <div key={i} className="card-in-deck" style={thisCardStyle}>
                <CharacterCard
                  character={Card[card]}
                  size="s"
                  shown={false}
                  hideDescription={true}
                />
              </div>
            );
          }
        })}
      </div>
    </section>
  );
};

export default Deck;
