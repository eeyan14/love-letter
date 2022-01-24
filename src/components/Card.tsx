import React from "react";
import "./Card.css";
import cardBack from "../love-letter-seal.png";

type CardProps = {
  character: string;
  size: string; // xs, s, m, l, xl
  hideDescription?: boolean;
};

const Card = ({ character, size, hideDescription }: CardProps) => {
  const descriptions: {
    [key: string]: {
      reference: string;
      card: string;
    };
  } = {
    princess: {
      reference: "Out of the round if you play/discard.",
      card: "If you play or discard this card, you are out of the round.",
    },
    countess: {
      reference: "Must play if you have King or Prince.",
      card: "If the King or Prince is in your hand, you must play this card.",
    },
    king: {
      reference: "Trade hands.",
      card: "Choose and trade hands with another player.",
    },
    chancellor: {
      reference: "Draw and return 2 cards.",
      card: "Draw 2 cards. Keep 1 card and put your other 2 on the bottom of the deck in any order.",
    },
    prince: {
      reference: "Discard a hand and redraw.",
      card: "Choose any player (including yourself). That player discards their hand and redraws.",
    },
    handmaid: {
      reference: "Immune to other cards until your next turn.",
      card: "Until your next turn, other players cannot choose your for their card effects.",
    },
    baron: {
      reference: "Compare hands.",
      card: "Choose and secretly compare hands with another player. Whoever has teh lower value is out of the round.",
    },
    priest: {
      reference: "Look at a hand.",
      card: "Choose and look at another player's hand.",
    },
    guard: {
      reference: "Guess a hand.",
      card: "Choose another player and character a non-Guard card. If that player has that card, they are out of the round.",
    },
    spy: {
      reference: "Gain favor if no one else plays/discards a Spy.",
      card: "At the end of the round, if you are the only player in the round who played or discarded a Spy, gain 1 favor token.",
    },
  };
  const characters = Object.keys(descriptions);

  const titleize = (str: string) => {
    if (!str) {
      return "";
    }

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const renderCharacterReference = () => {
    const highestNumber = 9;
    return Object.keys(descriptions).map((key, i) => {
      return (
        <p>
          <span className="medieval">
            {highestNumber - i}–{titleize(key)}
          </span>{" "}
          <span className="small">(x1):</span> {descriptions[key].reference}
        </p>
      );
    });
  };

  return (
    <div className={`card size-${size} character-${character}`}>
      {character === "unknown" && (
        <img src={cardBack} alt="Back of card" className="card-back" />
      )}

      {character === "reference" && renderCharacterReference()}

      {characters.includes(character) && (
        <p>
          <span className="medieval">{titleize(character)}</span>
        </p>
      )}

      {characters.includes(character) && !hideDescription && (
        <p>{descriptions[character].card}</p>
      )}
    </div>
  );
};

export default Card;
