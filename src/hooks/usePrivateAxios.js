import { useContext } from "react";
import { PrivateAxiosContext } from "../Context/PrivateAxiosContext";
const usePrivateAxios = () => {
  const privateAxios = useContext(PrivateAxiosContext)
  return (privateAxios)
}

export default usePrivateAxios;