import React from "react";
import "./App.css";
import Card from "./components/Card";
import ReferenceCard from "./components/ReferenceCard";

function App() {
  const numPlayers = 4;

  const renderOtherPlayers = () => {
    let numPlayersArr = [];
    for (let i = 0; i < numPlayers - 1; i++) {
      numPlayersArr.push(i);
    }
    return numPlayersArr.map((key) => {
      return <Card key={key} character="unknown" size="xs" />;
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
          <section className="deck">
            <p>Played/Discarded</p>
            <Card character="guard" size="s" hideDescription={true} />
          </section>

          <section className="deck">
            <p>Deck</p>
            <Card character="unknown" size="s" />
          </section>
        </div>

        <div className="column right">
          <section className="other-players">{renderOtherPlayers()}</section>
          <section className="my-cards">
            <Card character="guard" size="l" />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
