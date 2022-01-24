import { State } from "./state";
import { cardAmounts, Card, MAX_IN_HAND } from "./types";
const totalPlayers = 5;
const totalCards = cardAmounts.reduce((a, b) => a + b);

test("creates new State with correct amounts + randomized order", () => {
  let state = new State(totalPlayers, true);

  // check total card amount
  expect(state.deck.length).toBe(totalCards);

  // check count of each card type
  for (let i = 0; i < Card.__LENGTH; i++) {
    const card: Card = i;
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

  // test state with dealing
  // check cards are dealt
  state = new State(totalPlayers);
  expect(state.deck.length).toBe(totalCards - totalPlayers - 1);

  // check removed card
  expect(Card[state.removed]).not.toBeUndefined();

  // check for empty discard
  expect(state.discard.length).toBe(0);
});

test("create new State fails with invalid player numbers", () => {
  expect(() => new State(1)).toThrow();
  expect(() => new State(10)).toThrow();
});

test("draw => discard => endCheck throws when running out of cards", () => {
  const state = new State(totalPlayers);
  const len = state.deck.length;
  for (let i = 0; i < len; i++) {
    expect(() => state.drawCard(0)).not.toThrow();
    expect(() => state.discardCard(0, 0)).not.toThrow();
  }
  expect(() => state.draw(0)).toThrow();
});

test("draw => endCheck throws when players are eliminated", () => {
  const state = new State(totalPlayers);
  state.player.forEach((v, i) => {
    if (i != 0) {
      // skip for first player
      state.player[i].eliminated = true;
    }
  });
  expect(() => state.drawCard(0)).toThrow();
});

test("draw => draw cannot have more than 3 in hand", () => {
  const state = new State(totalPlayers);
  for (let i = 0; i < MAX_IN_HAND - 1; i++) {
    expect(() => state.drawCard(0)).not.toThrow();
  }
  expect(() => state.drawCard(0)).toThrow();
});

test("discard card invalid conditions", () => {
  const state = new State(totalPlayers);
  expect(() => state.discardCard(0, 1)).toThrow();
  expect(() => state.discardCard(0, 0)).toThrow();
});
