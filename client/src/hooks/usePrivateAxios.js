import { useContext } from "react";
import { PrivateAxiosContext } from "../Context/PrivateAxiosContext";
const usePrivateAxios = () => {
  const privateAxios = useContext(PrivateAxiosContext)
  return (privateAxios)
}

export default usePrivateAxios;

// import { privateAxios } from "../api/axios";
// import useRefreshToken from "../hooks/useRefreshToken";
// import useAuth from "../hooks/useAuth";
// import { useEffect } from "react";

// const usePrivateAxios = () => {
//   const refresh = useRefreshToken();
//   const { auth } = useAuth();
//   // const au = useCallback(()=>auth,[])
//   // useEffect(()=>{
//   //   console.log(auth);
//   // },[])

//   useEffect(() => {
//     const requestInterceptor = privateAxios.interceptors.request.use(config => {
//       console.log('private axios interceptor ... ' + auth?.accessToken);
//       if (!config.headers["Authorization"]) {
//         config.headers["Authorization"] = `${auth?.accessToken}`
//       }
//       return config;
//     },
//       error => { Promise.reject(error) }
//     )

//     const responstInterceptors = privateAxios.interceptors.response.use(response => response,
//       async error => {
//         const previousRequest = error?.config;
//         if (error?.response?.status === 403 && !previousRequest.sent) {
//           previousRequest.sent = true;
//           const newToken = await refresh();
//           previousRequest.headers['Authorization'] = `Bearer ${newToken}`;
//           return privateAxios(previousRequest)
//         }
//         return Promise.reject(error)
//       }
//     )
//     return () => {
//       privateAxios.interceptors.request.eject(requestInterceptor)
//       privateAxios.interceptors.response.eject(responstInterceptors)
//     }
//   }, [auth, refresh])

//   return privateAxios
// }

// export default usePrivateAxios;