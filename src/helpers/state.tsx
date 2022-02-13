import {
  Player,
  Card,
  cardAmounts,
  validateAmounts,
  MAX_IN_HAND,
  errors,
} from "./types";

export class State {
  player: Player[];
  deck: Card[];
  removed: Card;
  discard: Card[];
  spyPlayed: Player[];
  private currentTurn: number | null;
  private init: boolean;

  constructor(playerNum: number, testing?: boolean) {
    // validate players
    if (playerNum < 2 || playerNum > 6) {
      throw errors.ErrInvalidInput;
    }

    // validate cardAmounts length
    validateAmounts(cardAmounts);

    // create deck
    this.deck = [];
    for (let i = 0; i < Card.__LENGTH; i++) {
      const card: Card = i;
      for (let j = 0; j < cardAmounts[i]; j++) {
        this.deck.push(card);
      }
    }

    // randomize deck (https://stackoverflow.com/a/12646864)
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }

    // create players
    this.player = [];
    for (let i = 0; i < playerNum; i++) {
      const p: Player = {
        eliminated: false,
        hand: [],
      };
      this.player.push(p);
    }

    this.discard = [];
    this.removed = Card.__NULL;
    this.spyPlayed = [];
    this.currentTurn = null;
    this.init = true;

    if (!testing) {
      // distrtibute cards to players
      this.player.forEach((p, i) => this.drawCard(i));

      // remove first card
      this.removed = this.deck[this.deck.length - 1];
      this.deck.pop();
    }
    this.init = false;
  }

  // end condition checks
  endCheck(): boolean {
    const stillIn = this.player.map((p) => !p.eliminated).filter((x) => x);
    return this.deck.length === 0 || stillIn.length === 1;
  }

  // draw card for player
  drawCard(i: number) {
    if (this.endCheck()) {
      throw errors.ErrCannotDraw;
    }

    if (this.currentTurn == null && !this.init) {
      this.currentTurn = i;
    } else if (this.currentTurn != i && !this.init) {
      throw errors.ErrEndTurnNotCalled;
    }

    // max hand size + cannot draw if eliminated
    if (
      this.player[i].eliminated ||
      this.player[i].hand.length === MAX_IN_HAND
    ) {
      throw errors.ErrCannotDraw;
    }

    this.player[i].hand.push(this.deck[this.deck.length - 1]);
    this.deck.pop();
  }

  // discard card for player
  discardCard(playerIndex: number, cardIndex: number) {
    const p = this.player[playerIndex];
    if (cardIndex >= p.hand.length) {
      throw errors.ErrInvalidInput;
    }

    // only can discard last card if eliminated
    if (cardIndex === 0 && p.hand.length === 1 && !p.eliminated) {
      throw errors.ErrInvalidInput;
    }

    this.player[playerIndex].hand.splice(cardIndex, 1);
  }

  // end turn (check that state is valid to continue to next player)
  endTurn() {
    this.player.forEach((p) => {
      // check to make sure each player only has 1 card if they are still in the game
      if (!p.eliminated && p.hand.length != 1) {
        throw errors.ErrEndTurnTooManyCards;
      }

      // check to make sure eliminated players have discarded their cards
      if (p.eliminated && p.hand.length != 0) {
        throw errors.ErrEndTurnEliminated;
      }
    });
    this.currentTurn = null;
  }
}
