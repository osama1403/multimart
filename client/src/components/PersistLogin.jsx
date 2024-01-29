import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
  const refresh = useRefreshToken()
  const { auth } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const persist = localStorage.getItem('persist') ? JSON.parse(localStorage.getItem('persist')) : false
  console.log(persist);
  useEffect(() => {

    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false)
      }
    }

    (persist && !auth?.accessToken) ? verifyRefreshToken() : setIsLoading(false)

  }, [])
  return (
    <>
      {
        !persist ?
          <Outlet /> :
          isLoading ?
            <div className="w-full h-screen flex justify-center items-center">
              <p className="text-lg text-primary">Just a moment ...</p>
            </div> :
            <Outlet />
      }

    </>
  );
}

export default PersistLogin;