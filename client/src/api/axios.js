import axios from "axios";
const serverUrl = process.env.REACT_APP_URL
const baseurl = serverUrl+'/api'
export default axios.create({
  baseURL: baseurl,
  withCredentials: true
})
const privateAxios = axios.create({
  baseURL: baseurl,
})

export { privateAxios }

