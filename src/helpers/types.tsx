// INTERFACES
export interface Player {
  eliminated: boolean;
  hand: Card[];
  immune: boolean;
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

export enum Status {
  Init,
  Draw2Pick1,
  DiscardAndDraw,
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
  ErrCannotPlay: new Error("player cannot play card"),
  ErrCannotInsert: new Error("player cannot insert card to bottom of deck"),
  ErrEndTurnNotCalled: new Error("player turn not ended yet"),
  ErrEndTurnTooManyCards: new Error("cannot end turn: too many cards in hand"),
  ErrInvalidPlayer: new Error("invalid target player"),
  ErrPlayerImmune: new Error("player is immune"),
};
