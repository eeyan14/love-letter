import {
  Player,
  Card,
  Status,
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
  status: Status;
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
    this.status = Status.Init;

    if (!testing) {
      // distrtibute cards to players
      this.player.forEach((p, i) => this.drawCard(i));

      // remove first card
      this.removed = this.deck[this.deck.length - 1];
      this.deck.pop();
    }
    this.status = Status.__NULL;
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

    if (this.currentTurn == null && this.status != Status.Init) {
      this.currentTurn = i;
      this.player[i].immune = false; // handmaid immunity ends at the start of players next turn
    } else if (
      this.currentTurn != i &&
      this.status != Status.Init &&
      this.status != Status.DiscardAndDraw
    ) {
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

    // only can discard last card if eliminated or if forced to discard because prince played
    if (
      cardIndex === 0 &&
      p.hand.length === 1 &&
      !p.eliminated &&
      this.status != Status.DiscardAndDraw
    ) {
      throw errors.ErrInvalidInput;
    }

    this.discard.push(...this.player[playerIndex].hand.splice(cardIndex, 1));
  }

  // end turn (check that state is valid to continue to next player)
  endTurn() {
    this.player.forEach((p, i) => {
      // check to make sure each player only has 1 card if they are still in the game
      if (!p.eliminated && p.hand.length != 1) {
        throw errors.ErrEndTurnTooManyCards;
      }

      // clean up to make sure eliminated players have discarded their cards
      if (p.eliminated && p.hand.length != 0) {
        this.player[i].hand.forEach((e) => {
          this.discardCard(i, 0);
        });
      }
    });
    this.currentTurn = null;
    this.status = Status.__NULL;
  }

  insertCard(cardIndex: number) {
    if (this.status != Status.Draw2Pick1) {
      throw errors.ErrCannotInsert;
    }
    if (
      cardIndex >= this.player[this.currentTurn].hand.length ||
      this.player[this.currentTurn].hand.length == 1
    ) {
      throw errors.ErrInvalidInput;
    }
    this.deck.unshift(
      ...this.player[this.currentTurn].hand.splice(cardIndex, 1)
    );
  }

  // play a card from the current player's hand
  // returns final state of affected players
  // - index 0 is always current player
  // - index 1 is the target player but may not exist
  playCard(
    cardIndex: number,
    targetPlayer?: null | number,
    guess?: null | Card
  ): Player[] {
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

    const hand = this.player[this.currentTurn].hand;
    const card = hand[cardIndex];
    // if played card affects a target player, validate targeted player
    if (
      ![
        Card.Spy,
        Card.Handmaid,
        Card.Chancellor,
        Card.Countess,
        Card.Princess,
      ].includes(card)
    ) {
      // validate valid player
      if (
        targetPlayer == null ||
        targetPlayer >= this.player.length ||
        this.player[targetPlayer].eliminated
      ) {
        throw errors.ErrInvalidPlayer;
      }

      // validate immunity
      if (this.player[targetPlayer].immune) {
        throw errors.ErrPlayerImmune;
      }

      // if card is Guard, must have guess that is not Guard
      if (card == Card.Guard && (guess == null || guess == Card.Guard)) {
        throw errors.ErrInvalidInput;
      }
    }

    // must play countess if king or prince is also in hand
    if (
      hand.includes(Card.Countess) &&
      (hand.includes(Card.King) || hand.includes(Card.Prince)) &&
      card != Card.Countess
    ) {
      throw errors.ErrCannotPlay;
    }

    // play card
    this.discardCard(this.currentTurn, cardIndex);

    // affects of played card
    switch (card) {
      case Card.Spy:
        // no immediate affect when played, comes into play at the very end
        this.spyPlayed.push(this.currentTurn);
        break;
      case Card.Guard:
        // if played, can try to guess another players hand other than guard. if correct, other player is eliminated
        this.player[targetPlayer].eliminated =
          this.player[targetPlayer].hand[0] == guess;
        break;
      case Card.Priest:
        // if played, look at someone elses hand (targetPlayer hand is returned in function return)
        break;
      case Card.Baron:
        // if played, compare hands with another player. lower value card is eliminated
        this.player[this.currentTurn].eliminated =
          this.player[this.currentTurn].hand[0] <
          this.player[targetPlayer].hand[0];
        this.player[targetPlayer].eliminated =
          this.player[targetPlayer].hand[0] <
          this.player[this.currentTurn].hand[0];
        break;
      case Card.Handmaid:
        // if played, other players cannot choose player to be affected (until start of their next turn)
        this.player[this.currentTurn].immune = true;
        break;
      case Card.Prince:
        // if played, can cause another player to discard hand
        this.status = Status.DiscardAndDraw;
        this.discardCard(targetPlayer, 0);

        // if not eliminated, draw new card
        if (!this.player[targetPlayer].eliminated) {
          this.drawCard(targetPlayer);
        }
        this.status = Status.__NULL;
        break;
      case Card.Chancellor:
        // if played, draw two cards, choose one, place other two at bottom of deck in any order
        this.status = Status.Draw2Pick1;
        this.drawCard(this.currentTurn);
        this.drawCard(this.currentTurn);
        break;
      case Card.King:
        // if played, trade hands with another player
        this.player[this.currentTurn].hand = this.player[targetPlayer].hand;
        this.player[targetPlayer].hand = hand.filter((c) => c != Card.King);
        break;
      case Card.Countess:
        // no effect when played
        break;
      case Card.Princess:
        // if princess is played, player is eliminated (implemented in discardCard)
        break;
    }

    const affectedPlayers = [this.player[this.currentTurn]];
    targetPlayer != null && affectedPlayers.push(this.player[targetPlayer]);
    return affectedPlayers;
  }
}
