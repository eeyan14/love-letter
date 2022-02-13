import React, { useState } from "react";
import "App.css";

/* Components */
import CharacterCard from "./components/CharacterCard";
import Deck from "./components/Deck";
import ReferenceCard from "./components/ReferenceCard";

/* Helpers */
import { State } from "./helpers/state";

function App() {
  const numPlayers = 4;

  const renderOtherPlayers = () => {
    const numPlayersArr = [];
    for (let i = 0; i < numPlayers - 1; i++) {
      numPlayersArr.push(i);
    }
    return numPlayersArr.map((key) => {
      return (
        <CharacterCard key={key} character="Guard" shown={false} size="xs" />
      );
    });
  };

  const [gameState, setGameState] = useState<State>(new State(4));
  console.log("gameState", gameState);

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
          <section className="deck">
            <p>Played/Discarded</p>
            <CharacterCard
              character="Baron"
              size="s"
              shown={true}
              hideDescription={true}
            />
          </section>

          <Deck deck={gameState.deck} />
        </div>

        <div className="column right">
          <section className="other-players">{renderOtherPlayers()}</section>
          <section className="my-cards">
            <CharacterCard character="Guard" size="l" shown={true} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
