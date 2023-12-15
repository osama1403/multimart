import LoadingThreeDots from "../../components/LoadingThreeDots";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import useGetAxios from "../../hooks/useGetAxios";
import profilePlaceholder from '../../assets/images/profilePlaceholder.png';
import img from "../../assets/prod.jpeg"
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useContext, useEffect, useLayoutEffect } from "react";
import { socketIoContext } from "../../Context/SocketIoContext";

const Chat = () => {
  const serverUrl = process.env.REACT_APP_URL
  const { auth } = useAuth()
  const { chats, setChats } = useContext(socketIoContext)
  const role = auth.role
  const id = auth.id
  const now = new Date()
  const privateAxios = usePrivateAxios()
  const { data, loading, error } = useGetAxios('/chat', privateAxios, [])

  useLayoutEffect(() => {
    if (data) {
      setChats(data)
    }
  }, [data])

  return (
    <>
      <div className="grow max-w-6xl p-4 self-stretch mx-auto  mb-4 font-nunito">
        {
          error ? <p className="text-lg text-red-500 "> {error}</p>
            : loading ?
              <LoadingThreeDots />
              : chats &&

              <div className="rounded-2xl border shadow-md p-2 w-full [&>*:not(:last-child)]:border-b" >

                {chats?.sort((a, b) => new Date(b.lastMessage.date) - new Date(a.lastMessage.date)).map((el) => {
                  let pfp, name, peer_id
                  if (role === 'user') {
                    pfp = el.seller?.profilePicture
                    name = el.seller?.shopName
                    peer_id = el.seller?._id
                  } else {
                    pfp = el.user?.profilePicture
                    name = el.user?.firstName + ' ' + el.user?.lastName
                    peer_id = el.user?._id
                  }
                  let notification = el.lastMessage?.author !== id && el.lastMessage?.status !== 'read'
                  let date
                  if (el.lastMessage) {
                    const messageDate = new Date(el.lastMessage.date)
                    const secDiff = (now - messageDate) / 1000
                    if (secDiff < 60) {
                      date = 'now'
                    } else if (secDiff / 60 < 60) {
                      date = `${Math.floor(secDiff / 60)}m`
                    } else if (secDiff / 3600 < 24) {
                      date = `${Math.floor(secDiff / 3600)}h`
                    } else if (secDiff / (3600 * 24) < 31) {
                      date = `${Math.floor(secDiff / (3600 * 24))}d`
                    } else if (((now.getFullYear() - messageDate.getFullYear()) * 12) - messageDate.getMonth() + now.getMonth() < 12) {
                      date = `${12 - messageDate.getMonth() + now.getMonth()}mon`
                    } else {
                      date = `${now.getFullYear() - messageDate.getFullYear()}y`
                    }
                  }


                  console.log(el.lastMessage.date);
                  return (
                    <Link to={`${role === 'user' ? '/chat/' : '/seller/chat/'}${peer_id}`} key={el._id}>
                      <div className=" p-2 max-w-2xl flex items-center hover:bg-slate-200">
                        <img src={pfp ? serverUrl + '/' + pfp : profilePlaceholder} alt="" className="rounded-full w-16 h-16 border " />
                        <div className="grow px-2">
                          <div className="flex justify-between items-center">
                            <h1 className="font-semibold ">{name}</h1>
                            <p className="text-sm text-zinc-600"> {date} </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="line-clamp-1 w-fit text-ellipsis">{el.lastMessage ? el.lastMessage.text : ''}</p>
                            <div className={`bg-primary w-3 h-3 rounded-full ${notification ? '' : 'hidden'}`}> </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })
                }

              </div>


        }
      </div >
      {/* {error ? <p className="text-lg text-red-500"> {error}</p>
        :
        loading ?
          <LoadingThreeDots />
          : data &&
      } */}
    </>
  );
}

export default Chat;