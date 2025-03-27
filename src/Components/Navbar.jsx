import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);




  const logout = () => {
    setToken(false);
    localStorage.removeItem('token');
    navigate('/')
  };

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      <img onClick={() => navigate('/dashboard')} className='w-20 rounded-full cursor-pointer' src={assets.SDLogo} alt="Logo" />
      <ul className='hidden md:flex items-center gap-5 font-medium'>
        <NavLink to='/dashboard'>
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/add-expense'>
          <li className='py-1'>ADD EXPENSE</li>
          <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/add-project'>
          <li className='py-1'>ADD PROJECT</li>
          <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact'>
          <li className='py-1'>DATA ANALYSIS</li>
          <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
        </NavLink>
      </ul>
      <div className='flex items-center gap-4'>
        {token ? (
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img className='w-8 rounded-full' src={assets.profile_pic} alt="Profile" />
            <img className='w-2.5' src={assets.dropdown_icon} alt="Dropdown" />
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 flex flex-col rounded gap-4 bg-stone-100 p-4'>
                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className='bg-primary px-8 py-3 rounded-full text-white font-light hidden md:block'>Login</button>
        )}
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="Menu" />

        {/* Mobile Menu */}
        <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 bottom-0 top-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-20 rounded-full' src={assets.SDLogo} alt="Logo" />
            <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close" />
          </div>
          <ul className='flex flex-col items-center gap-2 px-5 mt-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/dashboard'><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/add-expense'><p className='px-4 py-2 rounded inline-block'>ADD EXPENSE</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/add-project'><p className='px-4 py-2 rounded inline-block'>ADD PROJECT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>DATA ANALYSIS</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

