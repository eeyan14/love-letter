import React from "react";
import "components/Card.css";
import assets from "assets";
import { CardDescriptions } from "helpers/types";

type CardProps = {
  character: string;
  size: string; // xs, s, m, l, xl; rendered size of card
  shown: boolean; // if true, shows character
  hideDescription?: boolean;
};

const CharacterCard = ({
  character,
  size,
  shown,
  hideDescription,
}: CardProps) => {
  const characters = Object.keys(CardDescriptions);

  const renderCharacterReference = () => {
    return Object.keys(CardDescriptions).map((key, i) => {
      return (
        <p key={i}>
          <span className="medieval">
            {CardDescriptions[key].points}–{key}
          </span>{" "}
          <span className="small">(x1):</span> {CardDescriptions[key].reference}
        </p>
      );
    });
  };

  return (
    <div className="card-container">
      <div
        className={`card size-${size} character-${character.toLowerCase()} ${
          shown ? "shown" : ""
        }`}
      >
        <div className="card-back">
          <img
            src={assets.waxSealLogo}
            alt="Back of card"
            className="card-back-img"
          />
        </div>

        {character === "Reference" ? (
          <div className="card-front">
            <div className="front-content">{renderCharacterReference()}</div>
          </div>
        ) : (
          <div className="card-front">
            <div className="front-content">
              <div className="card-header">
                <div className="point-container">
                  <img src={assets.waxSealBlack} className="wax-points" />
                  <p className="medieval">1</p>
                </div>

                <p className="medieval card-title">{character}</p>
              </div>

              {!hideDescription && <p>{CardDescriptions[character].card}</p>}
            </div>

            <div
              className="character-color"
              style={{ background: CardDescriptions[character].color }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCard;
