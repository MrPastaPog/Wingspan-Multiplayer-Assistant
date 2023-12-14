const rootDomain = '.' + window.location.hostname.split('.').slice(-2).join('.');
$(function() {
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
  $('.card').click(function() {
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
  socket.on('Update Cards', (tray) => {
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
})