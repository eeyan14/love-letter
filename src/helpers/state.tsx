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
  discard: Card[];
  spyPlayed: number[];
  currentTurn: number | null;
  private init: boolean;
  private removed: Card;
  private deck: Card[];

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
      this.player[i].immune = false; // handmaid immunity ends at the start of players next turn
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

    // handle special case if princess is discarded
    if (this.player[playerIndex].hand[cardIndex] == Card.Princess) {
      this.player[playerIndex].eliminated = true;
    }

    // TODO: allow discard if prince is used
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

  // play a card from the current player's hand
  playCard(cardIndex: number, targetPlayer?: number) {
    // validate enough cards to play
    if (
      this.currentTurn != null &&
      this.player[this.currentTurn].hand.length != 2
    ) {
      throw errors.ErrCannotPlay;
    }

    // validate card index
    if (cardIndex != 0 || cardIndex != 1) {
      throw errors.ErrInvalidInput;
    }

    // TODO: validate additional input parameters

    // TODO: validate if target player is immune or not

    switch (this.player[this.currentTurn].hand[cardIndex]) {
      case Card.Spy:
        // no immediate affect when played, comes into play at the very end
        this.spyPlayed.push(this.currentTurn)
        break;
      case Card.Guard:
        // if played, can try to guess another players hand other than guard. if correct, other player is eliminated
        break;
      case Card.Priest:
        // if played, look at someone elses hand
        break;
      case Card.Baron:
        // if played, compare hands with another player. lower value card is eliminated
        break;
      case Card.Handmaid:
        // if played, other players cannot choose player to be affected (until start of their next turn)
        this.player[this.currentTurn].immune = true
        break;
      case Card.Prince:
        // if countess is in hand, must play countess
        if (this.player[this.currentTurn].hand.includes(Card.Countess)) {
          throw errors.ErrCannotPlay
        }
        // if played, can cause another player to discard hand
        break;
      case Card.Chancellor:
        // if played, draw two cards, choose one, place other two at bottom of deck in any order
        break;
      case Card.King:
        // if countess is in hand, must play countess
        if (this.player[this.currentTurn].hand.includes(Card.Countess)) {
          throw errors.ErrCannotPlay
        }
        // if played, trade hands with another player
        break;
      case Card.Countess:
        // no effect when played
        break;
      case Card.Princess:
        // if princess is played, player is eliminated
        // implemented in discardCard
        break;
    }
    this.discardCard(this.currentTurn, cardIndex)
  }
}
