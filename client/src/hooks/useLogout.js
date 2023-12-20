import { useState } from "react";
import useAuth from "./useAuth";
import usePrivateAxios from "./usePrivateAxios";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const [loading, setLoading] = useState(false)
  const { auth, setAuth } = useAuth()
  const privateAxios = usePrivateAxios()
  const navigate = useNavigate()
  const logout = async () => {
    if (auth?.accessToken) {
      try {
        setLoading(true)
        await privateAxios.get('/auth/logout', { withCredentials: true })
        setAuth({ role: 'visitor' })
        navigate('/')
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }
  }
  return ({ logout, loading });
}

export default useLogout;