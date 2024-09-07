import React from 'react'
import { useAuth } from '../context/AuthContext'
import companyLogo from '../assets/rosterize.png';

const Header = () => {

  const { authData, logout } = useAuth();
  console.log(authData);
  return (
    <div className="flex-1 p-1 bg-gray-800">
    <header className="flex flex-row justify-between items-center m-2">
      {/* <button
        className="sm:hidden text-gray-800"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button> */}
      <div className='flex justify-center items-center gap-2'>
        <img src={companyLogo} width="60px" alt="Logo" className="mx-auto" />
        <p className="text-sm text-white hidden sm:text-xl sm:block">{authData?.role}</p>
      </div>
      <div className="flex items-center">
      <span className="mr-4 text-white text-sm sm:text-md">{authData?.email}</span>
        <button className="bg-gray-700 text-white p-2 rounded"
          onClick={() => {
            logout();
            window.location.href = '/landing-page';
          }}
        >
          Logout
        </button>
      </div>
    </header>
  </div>

  )
}

export default Header