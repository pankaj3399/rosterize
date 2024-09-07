import React, { useState } from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { addPlan, listPlans, deletePlan } from '../../api/Admin';
import Loader from '../../Components/Loader/Loader.jsx'

const ManagePrice = () => {

  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => listPlans()
  });

  const addPlanMutation = useMutation({
    mutationFn: addPlan,
    onSuccess: () => {
      setError('');
      setMessage('Plan added successfully');
      setNewPlan({ name: '', cost: '', range: '' });
      queryClient.invalidateQueries('plans');
    },
    onError: (error) => {
      setMessage('');
      setError(error.message);
    }
  });

  const deletePlanMutation = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      setError('');
      setMessage('Plan deleted successfully');
      queryClient.invalidateQueries('plans');
    },
    onError: (error) => {
      setMessage('');
      setError(error.message);
    }
  });

  const [newPlan, setNewPlan] = useState({ name: '', cost: '', range: '' });

  const handleAddPlan = () => {
    addPlanMutation.mutate(newPlan);
  };

  const handleDeletePlan = (planId) => {
    deletePlanMutation.mutate({ planId });
  };

  if(isLoading) return <Loader />

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Price</h1>
      <div className="border p-4 shadow-md mb-6">
        <div className="mb-4">
          <label className="block text-gray-700">Plan Name:</label>
          <input
            className="border w-full p-2"
            value={newPlan.name}
            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Range Of Users:</label>
          <input
            className="border w-full p-2"
            value={newPlan.range}
            onChange={(e) => setNewPlan({ ...newPlan, range: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Costs:</label>
          <input
            className="border w-full p-2"
            value={newPlan.cost}
            onChange={(e) => setNewPlan({ ...newPlan, cost: e.target.value })}
          />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={handleAddPlan}
          disabled={addPlanMutation.isPending}
        >
          {addPlanMutation.isPending ? 'Adding...' : 'Add Plan'}
        </button>
      </div>

      <div>
        {plans.map((plan, index) => (
          <div
            key={index}
            className="flex justify-between items-center border p-4 mb-2"
          >
            <div>
              <p className="font-bold">Plan Name: {plan.name}</p>
              <p>Monthly Cost: {plan.cost}</p>
              <p>User Limit: {plan.range}</p>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2"
              onClick={() => handleDeletePlan(plan._id)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ManagePrice;
