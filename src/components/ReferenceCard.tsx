import React, { useState } from "react";
import Card from "./Card";
import "./ReferenceCard.css";

const ReferenceCard = (props: any) => {
  const [showReferenceCard, setShowReferenceCard] = useState<boolean>(false);

  return (
    <div className="reference-card-container">
      <button
        className={showReferenceCard ? "selected" : ""}
        onClick={() => setShowReferenceCard(!showReferenceCard)}
      >
        Reference Card
      </button>

      {showReferenceCard && <Card character="reference" size="xl" />}
    </div>
  );
};

export default ReferenceCard;
