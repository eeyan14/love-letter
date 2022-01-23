import { State } from "./state";
import { cardAmounts, Card } from "./types";
const totalPlayers = 5;
const totalCards = cardAmounts.reduce((a, b) => a + b);

test("creates new State with correct amounts + randomized order", () => {
  const state = new State(totalPlayers, true);

  // check total card amount
  expect(state.deck.length).toBe(totalCards);

  // check count of each card type
  for (let i = 0; i < Card.__LENGTH; i++) {
    const card = Card[i];
    const count = state.deck.filter((c) => c == card).length;
    expect(count).toBe(cardAmounts[i]);
  }

  // check total players
  expect(state.player.length).toBe(totalPlayers);

  // check player init
  state.player.forEach((p) => {
    expect(p.eliminated).toBe(false);
    expect(p.hand.length).toBe(0);
  });

  // check randomization
  const stateNew = new State(totalPlayers, true);
  expect(state.deck.every((v, i) => state.deck[i] == stateNew.deck[i])).toBe(
    false
  );
});

test("create new State fails with invalid player numbers", () => {
  expect(() => new State(1)).toThrow();
  expect(() => new State(10)).toThrow();
});

test("deal functions correctly", () => {
  const state = new State(totalPlayers);

  // check cards are dealt
  expect(state.deck.length).toBe(totalCards - totalPlayers - 1);

  // check removed card
  expect(Card[state.removed]).not.toBeUndefined()

  // check for empty discard
  expect(state.discard.length).toBe(0)

});
