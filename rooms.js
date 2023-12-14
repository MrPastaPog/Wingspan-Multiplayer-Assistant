const {Birds, Bonuscards} = require('./cards.js')

class Room {
  constructor(roomid) {
    this.roomid = roomid
    this.Deck = structuredClone(Birds)
    this.Birdfeeder = structuredClone(Birds)
    this.Tray = []
    this.BonusCardDeck = structuredClone(Bonuscards)
    this.Clients = []
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
      this.Tray.push(this.pickCardAndRemoveRandom())
    }
  }
  refillTray() {
    let missing = 3 - this.Tray.length
    for(let i = 0; i < missing; i++) {
      this.Tray.push(this.pickCardAndRemoveRandom())
    }
  }
}

module.exports = { Room }