import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {useNavigate} from "react-router-dom"
import { AppContext } from '../context/AppContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { backendUrl, setToken } = useContext(AppContext)  // Get setToken from context

  const navigate=useNavigate()


  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      const { data } = await axios.post(`${backendUrl}/api/login`, { email, password })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)  // Use setToken from context
        navigate('/dashboard')
        toast.success("Login successful!")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message)
      toast.error(error.response?.data?.message || "Something went wrong!")
    }

    
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col items-start gap-3 p-8 m-auto min-w-[340px] sm:min-w-96 border border-[#DADADA] rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>Login</p>
        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] w-full mt-1 p-2 rounded ' type="email" required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] w-full mt-1 p-2 rounded ' type="password" required />
        </div>
        <button type='submit' className='bg-black text-white w-full py-2 rounded-md text-base'>Login</button>
      </div>
    </form>
  )
}

export default Login
