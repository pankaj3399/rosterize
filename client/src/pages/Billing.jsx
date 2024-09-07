import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listPlansAndReviews } from '../api/Public';
import { getCompany, updateCompanyPlan } from '../api/Company';
import { useAuth } from '../context/AuthContext';
import Loader from '../Components/Loader/Loader'

const Billing = () => {

    const queryClient = useQueryClient();
    const { authData } = useAuth();
    const [plan, setPlan] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['plansAndReviews'],
        queryFn: () => listPlansAndReviews(),
        // staleTime: 1000 * 60
    });

    const { data: companyData, isLoading: companyLoading, error: companyError } = useQuery({
        queryKey: ['company'],
        queryFn: () => getCompany(authData.company),
        enabled: !!authData.company,
        // staleTime: 1000 * 60
    });

    const updateCompanyPlanMutation = useMutation({
        mutationFn: updateCompanyPlan,
        onSuccess: (data) => {
            queryClient.invalidateQueries('company');
            setErrorMessage('');
            setMessage('Company Plan Updated');
        },
        onError: (error) => {
            setMessage('');
            setErrorMessage(error?.response?.data?.message || error?.message || 'Error updating company plan');
        }
    })

    const changePlan = () => {
        updateCompanyPlanMutation.mutate({ company_id: authData.company, plan_id: plan });
    }

    if (isLoading || companyLoading) return <Loader />

    return (
      <div>
          <h2 className="text-xl font-bold mb-4">Billing</h2>
          <div className="grid grid-cols-2 gap-4">
          
              <div>
                  <label className="block text-sm font-medium text-gray-700">Current Plan</label>
                  <input
                      type="text"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={companyData?.subscriptionPlan?.name || 'No Plan'}
                      disabled
                  />
              </div>
                      
            <div>
              <label className="block text-sm font-medium text-gray-700">Industry:</label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setPlan(e.target.value)}
              >
                <option>Select Plan:</option>
                  {data?.plans?.map((plan, index) => (
                      <option value={plan._id} key={index}>{plan.name}</option>
                  ))}
              </select>
            </div>
          </div>
            <div className='flex justify-center mt-4'>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={changePlan} disabled={updateCompanyPlanMutation.isPending}>
                    {updateCompanyPlanMutation.isPending ? 'Updating...' : 'Change Plan'}
                </button>
            </div>
            {message && <p className="text-green-500 mt-4">{message}</p>}
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    )
}

export default Billing
