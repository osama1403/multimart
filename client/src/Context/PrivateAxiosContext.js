import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { privateAxios } from "../api/axios";
import { useLayoutEffect, useEffect, createContext, useCallback } from "react";

const PrivateAxiosContext = createContext({})

const PrivateAxiosProvider = ({ children }) => {
  const refresh = useRefreshToken();
  const { auth,setAuth } = useAuth();

  useLayoutEffect(() => {
    const requestInterceptor = privateAxios.interceptors.request.use(config => {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `${auth?.accessToken}`
      }
      return config;
    },
      error => { Promise.reject(error) }
    )

    const responstInterceptors = privateAxios.interceptors.response.use(response => response,
      async error => {
        const previousRequest = error?.config;
        if (error?.response?.status === 403 && !previousRequest.sent) {
          previousRequest.sent = true;
          const newToken = await refresh();
          previousRequest.headers['Authorization'] = `${newToken}`;
          return privateAxios(previousRequest)
        } else if (error?.response?.status === 403) {
          setAuth({role:'visitor'})
          
        }
        return Promise.reject(error)
      }
    )
    return () => {
      privateAxios.interceptors.request.eject(requestInterceptor)
      privateAxios.interceptors.response.eject(responstInterceptors)
    }
  }, [auth?.accessToken, refresh])

  return (
    <PrivateAxiosContext.Provider value={privateAxios}>
      {children}
    </PrivateAxiosContext.Provider>
  );
}

export { PrivateAxiosProvider, PrivateAxiosContext };