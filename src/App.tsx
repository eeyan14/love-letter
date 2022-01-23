import React from "react";
import "./App.css";

import Card from "./components/Card";

function App() {
  const numPlayers = 4;

  const renderOtherPlayers = () => {
    let numPlayersArr = []
    for (let i = 0; i < numPlayers - 1; i++) {
      numPlayersArr.push(i)
    }
    return numPlayersArr.map(key => {
      return <Card key={key} character="unknown" size="small" />
    })
  }

  return (
    <div className="love-letter-app">
      <header>
        <h1>Love Letter</h1>
      </header>

      <div className="love-letter-app-main">
        <section>
        {renderOtherPlayers()}
        </section>

        <section>
          <Card character="guard" size="regular" />
        </section>

        <section>
          <Card character="reference" size="regular" />
        </section>
      </div>
    </div>
  );
}

export default App;
