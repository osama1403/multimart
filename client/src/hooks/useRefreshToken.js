import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get('/auth/refresh')
    if (auth?.accessToken) {
      setAuth(previous => { return { ...previous, accessToken: response.data.token } })
    } else {
      const { role } = response?.data
      if(role==='user'){
        const { token, id, userData } = response?.data
        setAuth({ accessToken: token, role, id, userData })
      }else{
        const { token, id } = response?.data
        setAuth({ accessToken: token, role, id })
      }
    }
    return response?.data?.token;
  }
  return refresh
}
export default useRefreshToken

// export default async () => {

//   const { setAuth } = useAuth();
//   const response = await axios.get('/api/refresh', {
//     withCredentials: true
//   })
//   setAuth(previous => { return { ...previous, accessToken: response.data.accessToken } })
//   return response.data.accessToken;
// }
// }