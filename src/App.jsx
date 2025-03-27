import React, { useState } from 'react'
import { Routes,Route,Navigate } from 'react-router-dom'
import AddProject from './Pages/AddProject'
import Login from './Pages/Login'
import AddExpense from './Pages/AddExpense'
import Profile from './Pages/Profile'
import ShowExpense from './Pages/ShowExpense'
import Navbar from './Components/Navbar' 
import Footer from './Components/Footer'
import {ToastContainer} from 'react-toastify';
import About from './Pages/About'
import Contact from './Pages/Contact'
import Dashboard from './Pages/Dashboard'
import RefreshHandler from './Pages/RefreshHandler'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  

    // PrivateRoute to protect routes that need authentication
    const PrivateRoute = ({ element }) => {
      return isAuthenticated ? element : <Navigate to="/" />;
    };
    
  return (
    <div className='mx-4 sm:mx-[10%]' >
       <RefreshHandler setisAutheticate={setIsAuthenticated} />
       <ToastContainer/>
      <Navbar/>
      <Routes>
      <Route path='/' element={<Login  setisAutheticate={setIsAuthenticated}/>}/> 
      <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
       <Route path='/dashboard' element={<PrivateRoute element={<Dashboard />} />}/> 
       <Route path='/add-project' element={<PrivateRoute element={<AddProject />} />}/> 
       <Route path='/add-expense' element={<PrivateRoute element={<AddExpense />} />}/> 
       <Route path='/show-expense/:projectId' element={<PrivateRoute element={<ShowExpense />} />}/> 
       <Route path='/my-profile' element={<PrivateRoute element={<Profile />} />}/> 
       <Route path='/about' element={<PrivateRoute element={<About />} />}/> 
       <Route path='/contact' element={<PrivateRoute element={<Contact />} />}/> 
      </Routes> 

      <Footer/>
    </div>
  )
}

export default App
