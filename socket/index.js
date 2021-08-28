var usersModels = require('../models/users')

module.exports = (server) => {
  var io = require('socket.io').listen(server)

  io.sockets.on('connection', function (socket) {
    socket.on('getmessages', function (idFrom, idTo, fn) {
      usersModels.getMessages(idFrom, idTo, function (err, messages) {
        if (err) {
          util.log('getmessages ERROR ' + err)
        } else fn(messages)
      })
    })
    socket.on('sendmessage', function (idTo, idFrom, message, fn) {
      usersModels.sendMessage(idTo, idFrom, message, function (err, messages) {
        if (err) {
          util.log('sendmessage ERROR ' + err)
        } else fn()
      })
    })
    var broadcastNewMessage = function (id) {
      socket.emit('newmessage', id)
    }
    usersModels.emitter.on('newmessage', broadcastNewMessage)

    var broadcastDelMessage = function () {
      socket.emit('delmessage')
    }
    usersModels.emitter.on('delmessage', broadcastDelMessage)

    socket.on('disconnect', function () {
      usersModels.emitter.removeListener('newmessage', broadcastNewMessage)
      usersModels.emitter.removeListener('delmessage', broadcastDelMessage)
    })
  })
}
