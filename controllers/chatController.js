const getIdAndRole = require('../utils/getIdAndRole')
const Chat = require('../models/Chat')
const Seller = require('../models/Seller')
const User = require('../models/User')
const { isObjectIdOrHexString, default: mongoose } = require('mongoose')
const Message = require('../models/Message')

const getChats = async (req, res) => {
  const { id, role } = getIdAndRole(req)
  let chats = []
  try {
    if (role === 'seller') {
      chats = await Chat.aggregate([
        {
          $match: {
            seller: new mongoose.Types.ObjectId(id)
          }
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
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $set: {
            user: { $arrayElemAt: ['$user', 0] },
          }
        },
        {
          $project: {
            'lastMessage': 1,
            'user._id': 1,
            'user.firstName': 1,
            'user.lastName': 1,
            'user.profilePicture': 1,
          }
        }
      ])
    } else if (role === 'user') {
      chats = await Chat.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(id)
          }
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
          $lookup: {
            from: 'sellers',
            localField: 'seller',
            foreignField: '_id',
            as: 'seller'
          }
        },
        {
          $set: {
            seller: { $arrayElemAt: ['$seller', 0] },
          }
        },
        {
          $project: {
            'lastMessage': 1,
            'seller._id': 1,
            'seller.shopName': 1,
            'seller.profilePicture': 1,
          }
        },
        {
          $sort: { 'lastMessage.date': 1 }
        }
      ])

    }

    res.json(chats)
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'server error' })
  }
}


// emit joined chat to peer to mark all messages as read when the user request the chat 

const getSingleChat = async (req, res) => {
  const sender = getIdAndRole(req);
  const { id } = req.params
  if (!isObjectIdOrHexString(id)) {
    return res.status(401).json({ msg: 'seller does not exist' })
  }
  // console.log(id);
  try {
    let peer = null, chat = null;

    if (sender.role === 'user') {
      peer = await Seller.findById(id, { shopName: 1, profilePicture: 1 })
      if (peer) {
        peer.role = 'seller'
      } else {
        return res.status(401).json({ msg: 'seller does not exist' })
      }
      chat = await Chat.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(sender.id),
            seller: new mongoose.Types.ObjectId(id)
          }
        },
        {
          $lookup: {
            from: 'messages',
            let: { chatid: '$_id' },
            pipeline: [
              {
                $match: { $expr: { $eq: ['$chatId', '$$chatid'] } }
              },
              {
                $sort: { date: 1 }
              }
            ],
            as: 'messages'
          }
        }
      ])

    } else if (sender.role === 'seller') {
      peer = await User.findById(id, { firstName: 1, lastName: 1, profilePicture: 1 })
      if (peer) {
        peer.role = 'user'
      } else {
        return res.status(401).json({ msg: 'user does not exist' })
      }
      chat = await Chat.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(id),
            seller: new mongoose.Types.ObjectId(sender.id)
          }
        },
        {
          $lookup: {
            from: 'messages',
            let: { chatid: '$_id' },
            pipeline: [
              {
                $match: { $expr: { $eq: ['$chatId', '$$chatid'] } }
              },
              {
                $sort: { date: 1 }
              }
            ],
            as: 'messages'
          }
        }
      ])

    }
    chat = chat[0]
    if (chat) {
      // console.log(res.app.locals?res.app.locals:'');
      res.app.locals.io.to(id).emit('join chat',sender.id)
      await Message.updateMany({ chatId: chat._id, author: id }, { status: 'read' })
      // console.log(res.locals?true:false);
      // send io event seen all 
    }
    res.json({ peer, chat })

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'server error' })
  }
}


module.exports = { getChats, getSingleChat }