import { useState, createContext } from 'react'

const AuthContext = createContext({});
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({role:'visitor'})
  return (
    <AuthContext.Provider value={{auth , setAuth}}>
      {children}
    </AuthContext.Provider>
  )
}
export {AuthContext,AuthProvider}