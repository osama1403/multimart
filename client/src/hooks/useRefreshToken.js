import axios from "axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const refresh = async () => {
    const response = await axios.get('/api/refresh', {
      withCredentials: true
    })
    setAuth(previous => { return { ...previous, accessToken: response.data.accessToken } })
    return response.data.accessToken;
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