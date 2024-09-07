import React from 'react';

const Sidebar = ({ setActiveComponent, isOpen, toggleSidebar }) => {
  return (
    <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0 transition-transform duration-200 ease-in-out z-30 w-64 bg-gray-800 text-white flex flex-col`}>
      <div className="p-4 text-xl font-bold flex justify-between items-center">
        <button onClick={toggleSidebar} className="md:hidden text-white focus:outline-none">
          ✕
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <button
          onClick={() => {
            setActiveComponent('dashboard');
            toggleSidebar();
          }}
          className="block w-full text-left px-2 py-2 text-sm font-medium bg-gray-700 rounded hover:bg-gray-600"
        >
          Home
        </button>
        <button
          onClick={() => {
            setActiveComponent('company-profile');
            toggleSidebar();
          }}
          className="block w-full text-left px-2 py-2 text-sm font-medium bg-gray-700 rounded hover:bg-gray-600"
        >
          Company Profile
        </button>
        {/* Add other navigation buttons */}
      </nav>
    </div>
  );
};

export default Sidebar;
