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

export const CardDescriptions: {
  [key: string]: {
    points: number;
    reference: string;
    card: string;
    color: string;
  };
} = {
  Spy: {
    points: 0,
    reference: "Gain favor if no one else plays/discards a Spy.",
    card: "At the end of the round, if you are the only player in the round who played or discarded a Spy, gain 1 favor token.",
    color: "#001219",
  },
  Guard: {
    points: 1,
    reference: "Guess a hand.",
    card: "Choose another player and character a non-Guard card. If that player has that card, they are out of the round.",
    color: "#005f73",
  },
  Priest: {
    points: 2,
    reference: "Look at a hand.",
    card: "Choose and look at another player's hand.",
    color: "#0a9396",
  },
  Baron: {
    points: 3,
    reference: "Compare hands.",
    card: "Choose and secretly compare hands with another player. Whoever has teh lower value is out of the round.",
    color: "#94d2bd",
  },
  Handmaid: {
    points: 4,
    reference: "Immune to other cards until your next turn.",
    card: "Until your next turn, other players cannot choose your for their card effects.",
    color: "#e9d8a6",
  },
  Prince: {
    points: 5,
    reference: "Discard a hand and redraw.",
    card: "Choose any player (including yourself). That player discards their hand and redraws.",
    color: "#ee9b00",
  },
  Chancellor: {
    points: 6,
    reference: "Draw and return 2 cards.",
    card: "Draw 2 cards. Keep 1 card and put your other 2 on the bottom of the deck in any order.",
    color: "#ca6702",
  },
  King: {
    points: 7,
    reference: "Trade hands.",
    card: "Choose and trade hands with another player.",
    color: "#bb3e03",
  },
  Countess: {
    points: 8,
    reference: "Must play if you have King or Prince.",
    card: "If the King or Prince is in your hand, you must play this card.",
    color: "#ae2012",
  },
  Princess: {
    points: 9,
    reference: "Out of the round if you play/discard.",
    card: "If you play or discard this card, you are out of the round.",
    color: "#9b2226",
  },
};

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
};
