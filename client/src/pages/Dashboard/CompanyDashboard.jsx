import React from 'react';

import {useQuery} from '@tanstack/react-query';
import { Dashboard } from '../../api/User';
import Loader from '../../Components/Loader/Loader.jsx'

const CompanyDashboard = () => {

  const {data, isLoading, isError} = useQuery({
    queryKey: 'companyDashboard',
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
    </div>
  );
};

export default CompanyDashboard;
