import { Player, Card, cardAmounts, validateAmounts } from "./types";

export class State {
  player: Player[];
  deck: Card[];
  removed: Card;
  discard: Card[];
  spyPlayed: Player[];

  constructor(playerNum: number, testing: boolean) {
    // validate players
    if (playerNum < 2 || playerNum > 6) {
      throw new Error("invalid player number");
    }

    // validate cardAmounts length
    validateAmounts(cardAmounts);

    // create deck
    this.deck = []
    for (let i = 0; i < Card.__LENGTH; i++) {
      const card = Card[i]
      for (let j = 0; j < cardAmounts[i]; j++) {
        this.deck.push(card)
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

    !testing && this.deal()
  }

  private deal() {
    // distrtibute cards to players
    this.player.forEach((p, i) => {
      this.player[i].hand.push(this.deck.pop())
    })

    // remove first card
    this.removed = this.deck.pop();
    this.discard = [];
  }
}
