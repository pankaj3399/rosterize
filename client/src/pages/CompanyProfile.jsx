import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCompany, updateCompany } from '../api/Company';
import { useAuth } from '../context/AuthContext';
import Loader from '../Components/Loader/Loader';

const CompanyProfile = () => {

  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [companyData, setCompanyData] = React.useState({});
  const queryClient = useQueryClient();
  const {authData} = useAuth();
  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['companyData'],
    queryFn: () => getCompany(authData.company),
    cacheTime: 0,
    retry: 0,
  });

  useEffect(() => {
    if (data) {
      setCompanyData(data);
    }
  },[data]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateCompany(data),
    onSuccess: () => {
      setError('');
      setMessage('Company profile updated successfully');
      queryClient.invalidateQueries('companyData');
    },
    onError: (error) => {
      setMessage('');
      setError(error.message);
    }
  })
  const saveCompany = () => {
    setCompanyData({...companyData, company_id: authData.company});
    updateMutation.mutate({...companyData, company_id: authData.company});
  }


  if (isLoading) return <Loader />;

  return (
    <div className="p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Company Profile</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name:</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={companyData.name || ''}
              onChange={e => setCompanyData({...companyData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">UEN Number:</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={companyData?.UEN || ''}
              onChange={e => setCompanyData({...companyData, UEN: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Industry:</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={companyData?.industry || ''}
              onChange={e => setCompanyData({...companyData, industry: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Address:</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={companyData?.address || ''}
              onChange={e => setCompanyData({...companyData, address: e.target.value})}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-6 mb-4">Contact Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={companyData?.phone || ''}
              onChange={e => setCompanyData({...companyData, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address:</label>
            <input
              type="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={companyData?.createdBy?.email || ''}
              onChange={e => setCompanyData({...companyData, createdBy: {...companyData.createdBy, email: e.target.value}})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Website:</label>
            <input
              type="string"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={companyData?.website || ''}
              onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded-md mr-4 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm"
            onClick={() => saveCompany()}
          >
            Save Changes
          </button>
        </div>
      </form>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {(error || queryError) && <p className="text-red-500 mt-4">{error || queryError}</p>}
    </div>
  );
};

export default CompanyProfile;
