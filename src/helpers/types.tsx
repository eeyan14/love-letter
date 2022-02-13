// INTERFACES
export interface Player {
  eliminated: boolean;
  hand: Card[];
}
export enum Card {
  Spy,
  Guard,
  Priest,
  Baron,
  Handmaid,
  Prince,
  Chancellor,
  King,
  Countess,
  Princess,
  __LENGTH,
  __NULL,
}

// CONSTANTS
// cardCounts follows the order of Card
export const cardAmounts: number[] = [2, 6, 2, 2, 2, 2, 2, 1, 1, 1];
export function validateAmounts(a: number[]) {
  if (Card.__LENGTH !== a.length) {
    throw new Error(
      "mismatch card amount array length and card type array length"
    );
  }
}
export const MAX_IN_HAND = 3;

// ERRORS
export const errors = {
  ErrInvalidInput: new Error("invalid input"),
  ErrCannotDraw: new Error("player cannot draw"),
  ErrEndTurnNotCalled: new Error("players turn not ended yet"),
  ErrEndTurnTooManyCards: new Error("cannot end turn: too many cards in hand"),
  ErrEndTurnEliminated: new Error(
    "cannot end turn: eliminated player has cards"
  ),
};
