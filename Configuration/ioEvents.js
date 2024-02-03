const { isObjectIdOrHexString, default: mongoose } = require('mongoose')
const Message = require('../models/Message')
const Chat = require('../models/Chat')
const Seller = require('../models/Seller')
const User = require('../models/User')

const ioRegisterEvents = (io, socket) => {
  /* 
  on new message :
  check if chat already exist between the two
  if chat exist:  create the message
  else:           verify that the peer exist and create the chat and then create the message 
  Ack the sender that the server received the message through callback
  emit the message to the otherside 
  if we receive a read message ack we tell the sender that the peer read the message
  */
  socket.on('new message', async (message, cb) => {
    console.log('new msg');

    try {
      if (socket.userRole === 'user') {
        let chat = await Chat.findOne({ user: socket.userId, seller: message.to })
        let msg
        if (chat) {
          msg = await Message.create({ chatId: chat._id, author: socket.userId, status: 'sent', text: message.text, date: new Date() })
        } else {
          if (!isObjectIdOrHexString(message.to)) {
            throw new Error('not valid id')
          }
          const seller = await Seller.findById(message.to)
          if (seller) {
            chat = await Chat.create({ user: socket.userId, seller: message.to })
            msg = await Message.create({ chatId: chat._id, author: socket.userId, status: 'sent', text: message.text, date: new Date() })
          } else {
            throw new Error('seller does not exist')
          }
        }

        cb(true, msg._id)
        io.to(message.to).emit('message', msg,)
        await Chat.updateOne({ _id: chat.id }, { lastMessage: msg._id })

      } else if (socket.userRole === 'seller') {

        let chat = await Chat.findOne({ seller: socket.userId, user: message.to })
        let msg
        if (chat) {
          msg = await Message.create({ chatId: chat._id, author: socket.userId, status: 'sent', text: message.text, date: new Date() })
        } else {
          if (!isObjectIdOrHexString(message.to)) {
            throw new Error('not valid id')
          }
          const user = await User.findById(message.to)
          if (user) {
            chat = await Chat.create({ seller: socket.userId, user: message.to })
            msg = await Message.create({ chatId: chat._id, author: socket.userId, status: 'sent', text: message.text, date: new Date() })
          } else {
            throw new Error('user does not exist')
          }
        }
        cb(true, msg._id)
        io.to(message.to).emit('message', msg)
        await Chat.updateOne({ _id: chat.id }, { lastMessage: msg._id })
      }
    } catch (error) {
      cb(false, null)
    }
    // console.log(message);
    // console.log(socket.id);
  })

  socket.on('userReadMessage', async (msg_id, peer_id) => {
    io.to(peer_id).emit('message read', msg_id, socket.userId)
    await Message.updateOne({ _id: msg_id }, { status: 'read' })
  })

  socket.on('needChat', async chatId => {
    let match = { _id: new mongoose.Types.ObjectId(chatId) }, lookup, project, set
    if (socket.userRole === 'user') {
      match.user = new mongoose.Types.ObjectId(socket.userId)
      lookup = {
        from: 'sellers',
        localField: 'seller',
        foreignField: '_id',
        as: 'seller'
      }
      project = {
        'lastMessage': 1,
        'seller._id': 1,
        'seller.shopName': 1,
        'seller.profilePicture': 1,
      }
      set = {
        seller: { $arrayElemAt: [`$seller`, 0] },
      }
    } else {
      match.seller = new mongoose.Types.ObjectId(socket.userId)
      lookup = {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user'
      }
      project = {
        'lastMessage': 1,
        'user._id': 1,
        'user.firstName': 1,
        'user.lastName': 1,
        'user.profilePicture': 1,
      },
        set = {
          user: { $arrayElemAt: [`$user`, 0] },
        }
    }
    try {

      let chat = await Chat.aggregate([
        {
          $match: match
        },
        {
          $lookup: {
            from: 'messages',
            localField: 'lastMessage',
            foreignField: '_id',
            as: 'lastMessage'
          }
        },
        {
          $set: {
            lastMessage: { $arrayElemAt: ['$lastMessage', 0] },
          }
        },
        {
          $lookup: lookup
        },
        {
          $set: set
        },
        {
          $project: project
        },
        {
          $sort: { 'lastMessage.date': 1 }
        }
      ])
      chat = chat[0]
      console.log(chat);
      if (chat) {
        io.to(socket.userId).emit('newRequestedChat', chat)
      }
    } catch (err) {
      console.log(err);
    }

  })


}

const ioConnectionNotifications = async (io, socket) => {
  let match
  if (socket.userRole === 'user') {
    match = { user: new mongoose.Types.ObjectId(socket.userId) }
  } else {
    match = { seller: new mongoose.Types.ObjectId(socket.userId) }
  }
  try {
    let notificationChats = await Chat.aggregate([
      {
        $match: match
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'lastMessage'
        }
      },
      {
        $set: {
          lastMessage: { $arrayElemAt: ['$lastMessage', 0] },
        }
      },
      {
        $match: {
          'lastMessage.status': 'sent'
        }
      }
    ])
    console.log(notificationChats);
    socket.emit('initNotificationChats', notificationChats)
  } catch (err) {
    console.log(err);
  }
}

module.exports = { ioRegisterEvents, ioConnectionNotifications }