import axios from "axios";
const serverUrl = process.env.REACT_APP_URL
const baseurl = serverUrl+'/api'
export default axios.create({
  baseURL: baseurl
})
const privateAxios = axios.create({
  baseURL: baseurl,
  // withCredentials: true
})

export { privateAxios }

