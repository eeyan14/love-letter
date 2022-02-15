import React, { useEffect, useState } from "react";
import "App.css";

/* Components */
import CharacterCard from "components/CharacterCard";
import Deck from "components/Deck";
import PlayerHand from "components/PlayerHand";
import ReferenceCard from "components/ReferenceCard";

/* Helpers */
import { Card } from "helpers/types";
import { State } from "helpers/state";

function App() {
  const numPlayers = 4;
  const [gameState, setGameState] = useState<State>(new State(numPlayers));
  console.log("gameState", gameState);

  const [deckRef, setDeckRef] = useState<HTMLElement | null>(null);
  console.log("deckRef", deckRef);

  useEffect(() => {
    const deckRef = document.getElementById("deck-deck-container");
    setDeckRef(deckRef);
  }, []);

  const renderOtherPlayers = () => {
    if (!gameState) {
      return;
    }

    return gameState.player.map((player, i) => {
      if (i === 0) {
        // first player is the person playing
        return;
      }

      return (
        <CharacterCard
          key={i}
          character={Card[player.hand[0]]}
          showCharacter={false}
          size="xs"
        />
      );
    });
  };

  return (
    <div className="love-letter-app">
      <header>
        <h1>Love Letter</h1>

        <div className="help">
          <ReferenceCard />
        </div>
      </header>

      <main>
        <div className="column left">
          <Deck deckType="discard" deck={gameState.discard} />
          <Deck deckType="deck" deck={gameState.deck} />
        </div>

        <div className="column right">
          <section className="other-players">{renderOtherPlayers()}</section>
          <PlayerHand
            deck={gameState.deck}
            deckRef={deckRef}
            player={gameState.player[0]}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
