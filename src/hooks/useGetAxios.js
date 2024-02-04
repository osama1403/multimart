import { useEffect, useState } from "react";

const useGetAxios = (url, axiosInstance, dep) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const aborter = new AbortController()
    const fetchData = async () => {
      setError('')
      setLoading(true)
      try {
        const result = await axiosInstance.get(url, { signal: aborter.signal })
        setData(result.data)
      } catch (error) {
        if (error.response) {
          setError(error.response.data?.msg ? error.response.data.msg : 'something went wrong')
        } else if (error.request && error.message !== 'canceled') {
          console.error(error);
          setError('no server response')
        }
      }
      setLoading(false)
    }
    // const fetchData = ()=>{}
    fetchData()
    return () => {
      aborter.abort()
    }
  }, [...dep, axiosInstance, url])

  return ({data, loading, error, setData});
}

export default useGetAxios;