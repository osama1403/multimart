import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate()

  const refresh = async () => {
    try {
      const response = await axios.get('/auth/refresh')
      if (auth?.accessToken) {
        setAuth(previous => { return { ...previous, accessToken: response.data.token } })
      } else {
        const { role } = response?.data
        if (role === 'user') {
          const { token, id, userData } = response?.data
          setAuth({ accessToken: token, role, id, userData })
        } else {
          const { token, id } = response?.data
          setAuth({ accessToken: token, role, id })
          navigate('/seller/dashboard', { replace: true })
        }
      }
      return response?.data?.token;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setAuth({ role: 'visitor' })
      }
    }
  }
  return refresh
}
export default useRefreshToken