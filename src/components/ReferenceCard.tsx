import React, { useState } from "react";
import CharacterCard from "./CharacterCard";
import "./ReferenceCard.css";

const ReferenceCard = () => {
  const [showReferenceCard, setShowReferenceCard] = useState<boolean>(false);

  return (
    <div className="reference-card-container">
      <button
        className={showReferenceCard ? "selected" : ""}
        onClick={() => setShowReferenceCard(!showReferenceCard)}
      >
        Reference Card
      </button>

      {showReferenceCard && (
        <div className="popup">
          <div className="popup-arrow" />
          <CharacterCard character="Reference" size="xl" shown={true} />
        </div>
      )}
    </div>
  );
};

export default ReferenceCard;
