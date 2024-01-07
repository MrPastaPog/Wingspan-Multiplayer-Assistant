const express = require('express')
const socketio = require('socket.io')
const app = express()
app.use(express.static('./Menu'))
app.use('/Room', express.static('./Room'))
const server = app.listen(80, () => {console.log('server started')})
const io = socketio(server)
const { Room } = require('./rooms.js')

let rooms = []
for(let i = 0; i < 1000; i++) {
  rooms.push(new Room(`${i + 1}`))
}


io.on('connection', (sock) => {

  let username = sock.handshake.query.username
  let roomid = sock.handshake.query.room
  console.log(username)
  if (username === null) { return; }
  if (isNaN(roomid)) { sock.emit('Disconnect'); return; }
  sock.join(roomid)
  let room = rooms[roomid]
  room.addClient(username, sock)
  if (room.upCard.length !== 0) {
    io.to(roomid).emit('Deck Card Update', room.upCard)
  }
  if(room.Clients.length === 1) {
    room.rerollBirdfeeder()
    room.resetDeck()
    room.resetTray()
  }
  io.to(roomid).emit('Update Tray', room.Tray)
  console.log(room.Birdfeeder)
  io.to(roomid).emit('Update Birdfeeder', room.Birdfeeder, room.ChosenDice)
  sock.on('Work', () => {console.log('please work')})
  sock.on('RemoveCard', (index) => {
    console.log(index)
    room.pickCardAndRemoveTray(index)

    io.to(roomid).emit('Update Tray', room.Tray)
  })
  sock.on('Reset Tray', () => {
    room.resetTray()
    io.to(roomid).emit('Update Tray', room.Tray)
  })
  sock.on('Refill Tray', () => {
    room.refillTray()
    io.to(roomid).emit('Update Tray', room.Tray)
  })
  sock.on('Request Deck Draw', (callback) => {
    let card = room.pickCardAndRemoveRandom()
    room.upCard = card
    sock.broadcast.to(roomid).emit('Deck Card Update', card)
    callback(card)

  })
  sock.on('Reroll', () => {
    room.rerollBirdfeeder()
    console.log(room.Birdfeeder)
    io.to(roomid).emit('Update Birdfeeder', room.Birdfeeder, room.ChosenDice)
  })
  sock.on('Reroll Outside', () => {
    room.rerollChosenDice()
    io.to(roomid).emit('Update Birdfeeder', room.Birdfeeder, room.ChosenDice)
  })
  sock.on('Remove From Birdfeeder', (food) => {
    console.log(food)
    room.Birdfeeder.splice(room.Birdfeeder.indexOf(food), 1)
    room.ChosenDice.push(food)
    console.log(room.ChosenDice)
    console.log(room.Birdfeeder)
    io.to(roomid).emit('Update Birdfeeder', room.Birdfeeder, room.ChosenDice)
  })
  sock.on('disconnect', () => {
    room.removeClient(username, sock)
    console.log(room.Clients.length)
  })
  sock.on('reconnect', () => {
    console.log(room.Tray)
    sock.emit('Update Tray', room.Tray)
  })
})