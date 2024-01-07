const {Birds, Bonuscards} = require('./cards.js')

class Room {
  constructor(roomid) {
    this.roomid = roomid
    this.Deck = structuredClone(Birds)
    this.Birdfeeder = []
    this.ChosenDice = []
    this.dice = ['Fish.png', 'Fruit.png', 'Seed.png', 'Rodent.png', 'Invertebrate.png', 'Invertebrate and Seed.png']
    this.Tray = []
    this.upCard = [];
    this.BonusCardDeck = structuredClone(Bonuscards)
    this.Clients = []
  }
  rerollBirdfeeder() {
    this.Birdfeeder = []
    this.ChosenDice = []
    for (let i = 0; i < 5; i++) {
      
      this.Birdfeeder.push(this.dice[Math.floor(Math.random()*this.dice.length)])
    }
  }
  rerollChosenDice () {
    let diceamount = this.ChosenDice.length
    this.ChosenDice = []
    for (let i = 0; i < diceamount; i++) {
      this.ChosenDice.push(this.dice[Math.floor(Math.random()*this.dice.length)])
    }
  }
  addClient(name, sock) {
    this.Clients.push({
      name: name,
      sock: sock
    })
  }
  removeClient(name, sock) {
    this.Clients.splice(this.Clients.indexOf({name: name, sock: sock}), 1)
  } 
  pickCardAndRemoveRandom() {
    let card = this.Deck[(Math.floor(Math.random() * this.Deck.length))]
    this.Deck.splice(this.Deck.indexOf(card), 1)
    return card
  }
  pickCardAndRemove(card) {
    this.Deck.splice(this.Deck.indexOf(card), 1)
  }
  pickCardAndRemoveTray(index) {
    this.Tray.splice(index, 1)
  }
  resetTray() {
    this.Tray = []
    for(let i = 0; i < 3; i++) {
      let card = this.pickCardAndRemoveRandom()
      if (card !== undefined) {
        this.Tray.push(card)
      }
      
    }
    console.log(this.Tray)
  }
  refillTray() {
    let missing = 3 - this.Tray.length
    for(let i = 0; i < missing; i++) {
      this.Tray.push(this.pickCardAndRemoveRandom())
    }
  }
  resetDeck() {
    this.Deck = structuredClone(Birds)
  }
}

module.exports = { Room }