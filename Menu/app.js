$(function () {
  $("#confirm").click(function () {
    sessionStorage.setItem('Username', JSON.stringify($('#username').val()))
    sessionStorage.setItem('RoomId', JSON.stringify($('#room').val()))
    location.href += 'Room'
  })
})