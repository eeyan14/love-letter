import React, { useState } from "react";
import Card from "./Card";
import "./ReferenceCard.css";

const ReferenceCard = () => {
  const [showReferenceCard, setShowReferenceCard] = useState<boolean>(true);

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
          <Card character="reference" size="xl" />
        </div>
      )}
    </div>
  );
};

export default ReferenceCard;
