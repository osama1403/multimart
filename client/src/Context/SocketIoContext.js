import { useEffect, createContext, useState } from 'react'
import io from 'socket.io-client'
import useAuth from '../hooks/useAuth'
import { useLocation } from 'react-router-dom'

const socketIoContext = createContext({})
const serverUrl = process.env.REACT_APP_URL

const SocketIoProvider = ({ children }) => {
  // let socket = null;
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [chats, setChats] = useState([])
  const [notification, setNotification] = useState(false)
  const { auth } = useAuth()
  const location = useLocation()

  useEffect(() => {
    console.log(location.pathname);
    setMessages([])
  }, [location.pathname])

  useEffect(() => {
    console.log( chats);
    if (chats) {
      const a = chats.find(el => {return (el.lastMessage.author !== auth.id && el.lastMessage.status !== 'read')})
      if (a) {
        setNotification(true)
      } else {
        setNotification(false)
      }
    }
  }, [chats])


  useEffect(() => {
    if (auth?.accessToken && !socket) {
      let socket = io(serverUrl, { auth: { token: auth.accessToken } })
      setSocket(socket)
      socket.on('connect', () => {
        // socket.emit('message',socket.id)
        console.log('connected to io');
      })
    }else if(!auth?.accessToken && socket){
      setSocket(null)
    }
  }, [auth?.accessToken])

  useEffect(() => {
    if (socket) {
      socket.removeAllListeners()
      socket.on('message', (msg) => {
        console.log(msg);
        console.log('new message delivered : ' + `msgauthor : ${msg.author} , path : ${location.pathname} ` + (auth.role === 'user' && location.pathname === `/chat/${msg.author}`) || (auth.role === 'seller' && location.pathname === `/seller/chat/${msg.author}`));
        if ((auth.role === 'user' && location.pathname === `/chat/${msg.author}`) || (auth.role === 'seller' && location.pathname === `/seller/chat/${msg.author}`)) {
          socket.emit('userReadMessage', msg._id, msg.author)
          setMessages(p => [...p, msg])
        } else if ((auth.role === 'user' && location.pathname === `/chat`) || (auth.role === 'seller' && location.pathname === `/seller/chat`)) {
          //if chat already exist update the last message
          //else we need to fetch the chats again

          if (chats.find(el => el._id === msg.chatId)) {
            setChats(p => p.map(el => {
              if (el._id === msg.chatId) {
                el.lastMessage = msg
              }
              return el
            }))
          } else {
            socket.emit('needChat', msg.chatId)
          }
        } else {
          setNotification(true);
        }

      })

      socket.on('newRequestedChat', (chat) => {
        setChats(p => [...p, chat])
      })

      socket.on('message read', (msgId, peerId) => {
        if ((auth.role === 'user' && location.pathname === `/chat/${peerId}`) || (auth.role === 'seller' && location.pathname === `/seller/chat/${peerId}`)) {
          setMessages(p => p.map(el => {
            if (el._id === msgId) {
              el.status = 'read'
            }
            return el
          }
          ))
        }
      })

      socket.on('join chat', (peer_id) => {
        console.log('join chat: ' + peer_id);
        if ((auth.role === 'user' && location.pathname === `/chat/${peer_id}`) || (auth.role === 'seller' && location.pathname === `/seller/chat/${peer_id}`)) {
          setMessages(p => p.map(el => {
            if (el.author === auth.id) {
              el.status = 'read'
            }
            return el
          })
          )
        }
      })

      socket.on('initNotificationChats', (notificationChats) => {
        console.log(notificationChats);
        if ((auth.role === 'user' && location.pathname !== `/chat`) || (auth.role === 'seller' && location.pathname !== `/seller/chat`)) {
          setChats(notificationChats)
        }
      })



    }
  }, [socket, location.pathname])


  return (
    <socketIoContext.Provider value={{ socket, messages, setMessages, chats, setChats,notification }}>
      {children}
    </socketIoContext.Provider>
  )
}
export { socketIoContext, SocketIoProvider };