import React from "react";
import img from "../../assets/img.png";
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen px-[120px]">
      <header className="flex justify-between items-center py-6">
        <div className="text-white bg-[#0E2442] py-4 px-[36px]">
          <h1 className="text-xl">LOGO</h1>
        </div>
      </header>
      <div className="grid grid-cols-2 my-[120px]">
        <div>
          <div className="text-center lg:text-left">
            <h2 className="text-[54px] font-medium text-black">Rosterize App</h2>
            <p className="mt-4 text-[16px] text-[#00221C] text-justify">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum."
            </p>
            {/* Buttons */}
            <div className="flex justify-center lg:justify-start mt-10 space-x-4">
              <Link to="/register" className="bg-[#0E2442] text-white py-2 px-9">
                Register
              </Link>
              <Link to="/login" className="bg-[#2E2E41] text-white py-2 px-9">
                Login
              </Link>
              <Link to="/enquiries" className="bg-[#0E2442] text-white py-2 px-9 ">
                Enquiries
              </Link>
              <Link to="/about-us" className="bg-[#2E2E41] text-white py-2 px-9">
                About Us
              </Link> 
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="mt-[-90px]">
            <img src={img} className="object-cover h-auto min-w-[650px]" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
