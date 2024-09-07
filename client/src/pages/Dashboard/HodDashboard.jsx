import React from 'react';

import {useQuery} from '@tanstack/react-query';
import { Dashboard } from '../../api/User';
import Loader from '../../Components/Loader/Loader.jsx'

const HodDashboard = () => {

  const {data, isLoading, isError} = useQuery({
    queryKey: 'hodDashboard',
    queryFn: async () => Dashboard(),
  });

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-gray-100 border-l-4 border-yellow-500 text-center">
          <p className="text-4xl text-yellow-600">{data.userCount}</p>
          <p className="text-gray-700">Employee Counts</p>
        </div>
        <div className="p-4 bg-gray-100 border-l-4 border-blue-500 text-center">
          <p className="text-4xl text-blue-600">{data.leaveCount}</p>
          <p className="text-gray-700">Today - Employee On Leaves Counts</p>
        </div>
        <div className="p-4 bg-gray-100 border-l-4 border-red-500 text-center">
          <p className="text-4xl text-red-600">{data.medicalLeaveCount}</p>
          <p className="text-gray-700">Today - Employee On MC Counts</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-4 bg-gray-100">
          <div className="text-lg font-semibold mb-2">Online</div>
          <div className="space-y-2">
          {
              data.statusOnline.map((status, index) => (
                <div key={index} className="group relative inline-block">
                  <button className="px-4 py-2 m-2 bg-blue-500 text-white rounded-md">
                    {`${status?.user?.firstName} ${status?.user?.lastName}`}
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-sm rounded-md px-2 py-1">
                    {status?.message}
                  </div>
                </div>
              ))
          }
            {/* <button className="px-4 py-2 m-2 bg-blue-500 text-white rounded-md">UserA</button>
            <button className="px-4 py-2 m-2 bg-blue-500 text-white rounded-md">UserB</button>
            <button className="px-4 py-2 m-2 bg-blue-500 text-white rounded-md">UserC</button>
            <button className="px-4 py-2 m-2 bg-blue-500 text-white rounded-md">Tony</button> */}
          </div>
        </div>
        <div className="p-4 bg-gray-100">
          <div className="text-lg font-semibold mb-2 text-red-500">Offline</div>
          <div className="space-y-2">
            {
              data?.statusOffline?.map((status, index) => (
                <button key={index} className="px-4 py-2 m-2 bg-red-500 text-white rounded-md">{`${status?.firstName} ${status?.lastName}`}</button>
              ))
            }
            {/* <button className="px-4 py-2 m-2 bg-red-500 text-white rounded-md">UserD</button>
            <button className="px-4 py-2 m-2 bg-red-500 text-white rounded-md">UserD</button> */}
          </div>
        </div>
        <div className="p-4 bg-gray-100">
          <div className="text-lg font-semibold mb-2 text-blue-500">Medical Leaves</div>
          <div className="space-y-2">
            {
              data?.leaveUsers?.map((leave, index) => (
                <button key={index} className="px-4 py-2 m-2 bg-teal-500 text-white rounded-md">{`${leave?.user?.firstName} ${leave?.user?.lastName}`}</button>
              ))
            }
            {/* <button className="px-4 py-2 m-2 bg-teal-500 text-white rounded-md">Chao</button>
            <button className="px-4 py-2 m-2 bg-teal-500 text-white rounded-md">Keng</button>
            <button className="px-4 py-2 m-2 bg-teal-500 text-white rounded-md">Jess</button>
            <button className="px-4 py-2 m-2 bg-teal-500 text-white rounded-md">NotHere</button> */}
          </div>
        </div>
      </div>

    </div>
  );
};

export default HodDashboard;
