import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import { FaCheck, FaRegClock } from "react-icons/fa";
import { BiError } from "react-icons/bi";
import { socketIoContext } from "../../Context/SocketIoContext";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import useGetAxios from "../../hooks/useGetAxios";
import LoadingThreeDots from "../../components/LoadingThreeDots";
import profilePlaceholder from '../../assets/images/profilePlaceholder.png';
import useAuth from "../../hooks/useAuth";

const SingleChat = () => {
  const privateAxios = usePrivateAxios()
  const serverUrl = process.env.REACT_APP_URL
  const { id } = useParams()
  console.log(id);
  const { auth } = useAuth()
  const { socket, messages, setMessages, setChats } = useContext(socketIoContext)
  const { data, loading, error } = useGetAxios(`/chat/${id}`, privateAxios, [])

  // const [chatMessages, setChatMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    if (data?.chat) {
      setMessages(p => [...data?.chat?.messages, ...p])
      setChats(p => p.map(el => {
        if (el._id === data.chat._id && el.lastMessage.author !== auth._id && el.lastMessage?.status !== 'read') {
          el.lastMessage.status = 'read'
        }
        return el
      }))
    }
  }, [data,auth?._id,setChats,setMessages])

  // useEffect(() => {
  //   console.log('messahes = '+ messages.length);
  //   return () => { setMessages([]) }
  // }, [])

  const handleSendMessage = () => {
    if (text.trim()) {
      const message = { author: auth.id, to: id, text: text.trim(), status: 'sending', time: new Date() }
      console.log(message);
      setMessages(p => [...p, message])
      setText('')

      socket.emit('new message', message, (success, id) => {
        setMessages(p => p.map(el => {
          if (el === message) {
            if (success) {
              el.status = 'sent'
              el._id = id
            } else {
              el.status = 'error'
            }
          }
          return el
        }))
      })
    }
  }


  return (
    <>
      <div className={`${auth.role==='user'?' h-[calc(100vh-116px)] sm:h-[calc(100vh-64px)]': 'h-[calc(100vh-52px)] sm:h-screen' } grow max-w-6xl p-2 sm:p-4 self-stretch mx-auto font-nunito`}>
        {
          error ? <p className="text-lg text-red-500 "> {error}</p>
            : loading ?
              <LoadingThreeDots />
              : data &&
              <>
                <div className="rounded-2xl bg-slate-200 h-full border shadow-md flex flex-col w-full ">
                  {/* header */}
                  <div className="flex items-center px-2 py-1 rounded-2xl gap-3 bg-white">
                    <img src={data?.peer?.profilePicture ? serverUrl + '/' + data.peer.profilePicture : profilePlaceholder} alt="" className="rounded-full w-12 h-12 border " />
                    <h1 className="font-semibold text-xl ">{auth.role === 'user' ? data?.peer?.shopName : data?.peer?.firstName + ' ' + data?.peer?.lastName}</h1>
                  </div>

                  <div className="grow flex flex-col-reverse px-2 overflow-y-auto  noscrollbar">
                    <div className="flex flex-col">
                      {
                        messages.map((el, idx) => {
                          return (
                            <div className={`flex mb-3 ${el.author === auth.id ? 'justify-end' : 'justify-start'}`} key={idx}>
                              <div className="flex items-end ">
                                <div className={` mr-1 text-sm ${(el.status === 'read' || el.status === 'error') ? 'text-primary' : 'text-zinc-600'} ${el.author === auth.id ? '' : 'hidden'}`}>
                                  {el.status === 'sending' ? <FaRegClock /> : el.status === 'error' ? <BiError /> : <FaCheck />}
                                </div>

                                <div className={`px-3 py-1 ${el.author === auth.id ? 'bg-red-300' : 'bg-blue-300'} rounded-lg w-fit max-w-sm`}>
                                  <p>{el.text}</p>
                                  {/* <p className="text-zinc-600 w-full text-right text-xs">9:26</p> */}
                                </div>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>

                  </div>




                  {/* messages */}
                  {/* typingbar */}
                  <div className="flex items-center px-4 py-2 rounded-2xl gap-3 bg-white">
                    {/* <input type="text" value={text} placeholder="type something .." onChange={(e) => { setText(e.target.value) }}
              className="outline-none grow border-b p-2 pb-0 text-lg " /> */}

                    <textarea name="" id="" value={text} placeholder="type something .." onChange={(e) => { setText(e.target.value) }}
                      className="outline-none grow border-b  text-lg resize-none noscrollbar" rows="1" >
                    </textarea>

                    <button className=" p-2 text-2xl  text-zinc-500 rounded-full hover:text-primary" onClick={handleSendMessage}><IoSend className="relative left-[" /></button>

                  </div>

                </div>
              </>
        }
      </div>
    </>
  );
}

export default SingleChat;