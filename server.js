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
  sock.join(roomid)
  let room = rooms[roomid]
  room.addClient(username, sock)
  if(room.Clients.length === 1) {
    room.resetDeck()
    room.resetTray()
  }
  io.to(roomid).emit('Update Cards', room.Tray)
  sock.on('Work', () => {console.log('please work')})
  sock.on('RemoveCard', (index) => {
    console.log(index)
    room.pickCardAndRemoveTray(index)
    console.log(room.Tray)
    io.to(roomid).emit('Update Cards', room.Tray)
  })
  sock.on('Reset Tray', () => {
    room.resetTray()
    io.to(roomid).emit('Update Cards', room.Tray)
  })
  sock.on('disconnect', () => {
    room.removeClient(username, sock)
    console.log(room.Clients.length)
  })
  
})