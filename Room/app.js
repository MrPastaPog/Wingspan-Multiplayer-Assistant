const rootDomain = '.' + window.location.hostname.split('.').slice(-2).join('.');
$(function() {
  $('#chosen > img').attr('hidden', true)
  console.log(JSON.parse(sessionStorage.getItem('Username')))
  if (JSON.parse(sessionStorage.getItem('Username')) === null) {
    location.href = location.origin
    return
  }
  const socket = io(
    {query: {
      username: JSON.parse(sessionStorage.getItem('Username')),
      room: JSON.parse(sessionStorage.getItem('RoomId'))
    }}
  )

  socket.emit('Work')
  console.log(JSON.parse(sessionStorage.getItem('Username')))
  $('#reroll').click(function () {
    socket.emit('Reroll')
  })
  $('#rerollout').click(function () {
    socket.emit('Reroll Outside')
  })
  $('.draw').click(function () {
    
    socket.emit('Request Deck Draw', (card) => {
      $('.card.faceup').attr('hidden', false)
      $(`#title.faceup`).text(card.name)
      $(`#habitats.faceup`).text(card.habitats)
      $(`#cost.faceup`).text(card.cost)
      $(`#points.faceup`).text(card.points + ' points')
      $(`#maxeggs.faceup`).text('max '+ card.max_eggs + ' eggs')
      $(`#nesttype.faceup`).text(card.nest_type)
      $(`#wingspan.faceup`).text(card.wingspan + 'cm')
      $(`#power.faceup`).text(card.bird_power)
      let power = $(`#power.faceup`).text()
      if (power.includes('once between turns:')) {
        $(`#power.faceup`).css('background-color', 'pink')
      } else if (power.includes('when activated:')) {
        $(`#power.faceup`).css('background-color', 'orange')
      } else {
        $(`#power.faceup`).css('background-color', 'white');

      }
    })
  })
  $('#food > .dice').click(function () {
    console.log($(this).attr('src'))
    let food = $(this).attr('src').substring(9)
    console.log(food)
    socket.emit('Remove From Birdfeeder', food)
  })
  $('#tray > .card').click(function () {
    let index = '0'
    switch(this.className) {
      case 'card second':
        index = '1'
        break;
      case 'card third':
        index = '2'
        break;
    }
    console.log('pressed')
    socket.emit('RemoveCard', index)
    
  })
  $('#resettray').click(function () {
    socket.emit('Reset Tray')
  })
  $('#refilltray').click(function () {
    socket.emit('Refill Tray')
  })
  socket.on('Deck Card Update', (card) => {
    $('.card.faceup').attr('hidden', false)
    $(`#title.faceup`).text(card.name)
    $(`#habitats.faceup`).text(card.habitats)
    $(`#cost.faceup`).text(card.cost)
    $(`#points.faceup`).text(card.points + ' points')
    $(`#maxeggs.faceup`).text('max '+ card.max_eggs + ' eggs')
    $(`#nesttype.faceup`).text(card.nest_type)
    $(`#wingspan.faceup`).text(card.wingspan + 'cm')
    $(`#power.faceup`).text(card.bird_power)
    let power = $(`#power.faceup`).text()
    if (power.includes('once between turns:')) {
      $(`#power.faceup`).css('background-color', 'pink')
    } else if (power.includes('when activated:')) {
      $(`#power.faceup`).css('background-color', 'orange')
    } else {
      $(`#power.faceup`).css('background-color', 'white');
    }
  })
  socket.on('Update Birdfeeder', (birdfeeder, notbirdfeeder) => {
    console.log(notbirdfeeder)
    let count = ['first', 'second', 'third', 'fourth', 'fifth']
    for (let i = 0; i < birdfeeder.length; i++) {
      $(`#food > .dice.${count[i]}`).attr('src', `./Images/${birdfeeder[i]}`)
    }
    for (let i = 0; i < notbirdfeeder.length; i++) {
      $(`#chosen > .dice.${count[i]}`).attr('src', `./Images/${notbirdfeeder[i]}`)
    }
    $('.dice').attr('hidden', false)
    if(birdfeeder.length < 5) {
      $('#food > .dice.fifth').attr('hidden', true)
    }
    if(birdfeeder.length < 4) {
      $('#food > .dice.fourth').attr('hidden', true)
    }
    if(birdfeeder.length < 3) {
      $('#food > .dice.third').attr('hidden', true)
    }
    if(birdfeeder.length < 2) {
      $('#food > .dice.second').attr('hidden', true)
    }
    if(birdfeeder.length < 1) {
      $('#food > .dice.first').attr('hidden', true)
    }
    if(notbirdfeeder.length < 5) {
      $('#chosen > .dice.fifth').attr('hidden', true)
    }
    if(notbirdfeeder.length < 4) {
      $('#chosen > .dice.fourth').attr('hidden', true)
    }
    if(notbirdfeeder.length < 3) {
      $('#chosen > .dice.third').attr('hidden', true)
    }
    if(notbirdfeeder.length < 2) {
      $('#chosen > .dice.second').attr('hidden', true)
    }
    if(notbirdfeeder.length < 1) {
      $('#chosen > .dice.first').attr('hidden', true)
    }
  })
  socket.on('Update Tray', (tray) => {
    console.log(tray)
    switch (tray.length) {
      case 2:
        $('.card.third').css("visibility", "hidden");
        break;
      case 1:
        $('.card.third').css("visibility", "hidden");
        $('.card.second').css("visibility", "hidden");
        break;
      case 0:
        $('.card.third').css("visibility", "hidden");
        $('.card.second').css("visibility", "hidden");
        $('.card.first').css("visibility", "hidden");
        break;
      default:
        $('.card').css('visibility', 'visible')
    }
    let order = ['first', 'second', 'third'];
    for(let i = 0; i < tray.length; i++) {
      $(`#title.${order[i]}`).text(tray[i].name)
      $(`#habitats.${order[i]}`).text(tray[i].habitats)
      $(`#cost.${order[i]}`).text(tray[i].cost)
      $(`#points.${order[i]}`).text(tray[i].points + ' points')
      $(`#maxeggs.${order[i]}`).text('max '+ tray[i].max_eggs + ' eggs')
      $(`#nesttype.${order[i]}`).text(tray[i].nest_type)
      $(`#wingspan.${order[i]}`).text(tray[i].wingspan + 'cm')
      $(`#power.${order[i]}`).text(tray[i].bird_power)
      let power = $(`#power.${order[i]}`).text()
      if (power.includes('once between turns:')) {
        $(`#power.${order[i]}`).css('background-color', 'pink')
      } else if (power.includes('when activated:')) {
        $(`#power.${order[i]}`).css('background-color', 'orange')
      } else {
        $(`#power.${order[i]}`).css('background-color', 'white');

      }
    }
  })
  socket.on('Disconnect', () => {
    location.href = '/'
  })
})