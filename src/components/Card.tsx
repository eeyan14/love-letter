import React from "react";
import "./Card.css";
import assets from "../assets";

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
      color: string;
    };
  } = {
    princess: {
      reference: "Out of the round if you play/discard.",
      card: "If you play or discard this card, you are out of the round.",
      color: "#9b2226",
    },
    countess: {
      reference: "Must play if you have King or Prince.",
      card: "If the King or Prince is in your hand, you must play this card.",
      color: "#ae2012",
    },
    king: {
      reference: "Trade hands.",
      card: "Choose and trade hands with another player.",
      color: "#bb3e03",
    },
    chancellor: {
      reference: "Draw and return 2 cards.",
      card: "Draw 2 cards. Keep 1 card and put your other 2 on the bottom of the deck in any order.",
      color: "#ca6702",
    },
    prince: {
      reference: "Discard a hand and redraw.",
      card: "Choose any player (including yourself). That player discards their hand and redraws.",
      color: "#ee9b00",
    },
    handmaid: {
      reference: "Immune to other cards until your next turn.",
      card: "Until your next turn, other players cannot choose your for their card effects.",
      color: "#e9d8a6",
    },
    baron: {
      reference: "Compare hands.",
      card: "Choose and secretly compare hands with another player. Whoever has teh lower value is out of the round.",
      color: "#94d2bd",
    },
    priest: {
      reference: "Look at a hand.",
      card: "Choose and look at another player's hand.",
      color: "#0a9396",
    },
    guard: {
      reference: "Guess a hand.",
      card: "Choose another player and character a non-Guard card. If that player has that card, they are out of the round.",
      color: "#005f73",
    },
    spy: {
      reference: "Gain favor if no one else plays/discards a Spy.",
      card: "At the end of the round, if you are the only player in the round who played or discarded a Spy, gain 1 favor token.",
      color: "#001219",
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
        <img
          src={assets.waxSealLogo}
          alt="Back of card"
          className="card-back"
        />
      )}

      {character === "reference" && renderCharacterReference()}

      {characters.includes(character) && (
        <div className="card-header">
          <div className="point-container">
            <img src={assets.waxSealBlack} className="wax-points" />
            <p className="medieval">1</p>
          </div>

          <p className="medieval card-title">{titleize(character)}</p>
        </div>
      )}

      {characters.includes(character) && !hideDescription && (
        <p>{descriptions[character].card}</p>
      )}

      {characters.includes(character) && (
        <div
          className="character-color"
          style={{ background: descriptions[character].color }}
        />
      )}
    </div>
  );
};

export default Card;
