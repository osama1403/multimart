import { useState } from "react"
import { Link } from 'react-router-dom'
import { BsEyeSlash, BsEye, BsThreeDots } from 'react-icons/bs'
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showpwd, setShowPwd] = useState(false)
  const [alert, setAlert] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/seller/dashboard'

  const handlesubmit = async (e) => {
    e.preventDefault();
    setAlert('')

    if (!email || !password) {
      setAlert('please provide both email and password')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post('/auth/sellerlogin', { email, password })
      const { token, role, id } = response?.data
      setAuth({ accessToken: token, role, id })
      navigate(from, { replace: true })
      // console.log(response);
    } catch (error) {
      if (error.response) {
        setAlert(error.response.data?.msg)
      } else if (error.request) {
        setAlert('no server response')
      }
    }
    setLoading(false)
  }

  return (
    <>
      <div className="w-full min-h-[calc(100vh-64px)] flex justify-center items-center">

        <div className="font-nunito w-full flex flex-col my-3 items-center mx-4 max-w-xl p-6 rounded-xl border shadow-xl shadow-zinc-300">
          <h1 className="  text-2xl text-primary font-bold">Seller Login</h1>
          <form onSubmit={handlesubmit} className='mb-3 mx-auto w-full flex flex-col space-y-4 max-w-sm text-lg font-light '>
            <div>

              <label htmlFor="email" className="font-bold px-1">email :</label>
              <input type="email" autoComplete="off" id="email" value={email} onChange={(e) => { setEmail(e.target.value) }}
                className='w-full  px-3 py-1  rounded-full outline-none border shadow-sm'
              />
            </div>
            <div>

              <label htmlFor="password" className="font-bold px-1 ">password :</label>
              <div className="flex items-stretch w-full  px-3 py-1 mb-1 rounded-full  border shadow-sm">
                <input type={`${showpwd ? "text" : "password"}`} id="password" value={password} onChange={(e) => { setPassword(e.target.value) }}
                  className='grow outline-none'
                />
                <button type="button"
                  onClick={() => { setShowPwd(!showpwd) }}
                >
                  {showpwd ? <BsEye /> : <BsEyeSlash />}
                </button>

              </div>
              <div className="h-8">
                <p className="text-red-500 mb-2">{alert}</p>
              </div>
            </div>
            <button className="mx-auto inline-block px-6 py-1 border-2 text-primary font-semibold border-primary rounded-full hover:px-7 transition-all duration-200 cursor-pointer">
              {loading ? <BsThreeDots className="text-3xl" /> : "login"}
            </button>
          </form>

          <div>
            <p className="inline-block">need an account?</p><Link to={'/seller/signup'} className='underline inline-block ml-3' >sign up</Link>
          </div>
        </div>

      </div>
    </>
  );
}

export default Login;