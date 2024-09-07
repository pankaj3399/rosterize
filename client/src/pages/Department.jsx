import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { createDepartment, listDepartments, removeDepartment } from '../api/Department';
import { useAuth } from '../context/AuthContext';
import Loader from '../Components/Loader/Loader.jsx';

const DepartmentManagement = () => {
  const [newDepartment, setNewDepartment] = useState('');
  const {authData} = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: () => listDepartments(authData.company),
    enabled: !!authData.company,
    retry: 0,
  });

  const addDepartmentMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: (data) => {
      queryClient.invalidateQueries('departments');
    },
    onError: (error) => {
      console.error('Add department failed:', error);
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: removeDepartment,
    onSuccess: (data) => {
      queryClient.invalidateQueries('departments');
    },
    onError: (error) => {
      console.error('Delete department failed:', error);
    },
  });

  const handleAddDepartment = () => {
    if (newDepartment.trim() !== '') {
      addDepartmentMutation.mutate({ name: newDepartment, companyId: authData.company });
      setNewDepartment('');
    }
  };

  const handleDeleteDepartment = (id) => {
    deleteDepartmentMutation.mutate(id);
  };

  if(isLoading) return <Loader />

  if(error) return <p>Error loading departments: {error.message}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Department Management</h2>
      <div className="mb-4">
        <label className="block font-bold mb-2">List Of Departments:</label>
        <ul className="border rounded-md p-4 max-h-40 overflow-y-auto">
          {data?.map((dept, index) => (
            <li
              key={index}
              className="flex justify-between items-center mb-2"
            >
              <span>{dept.name}</span>
              <button
                className="text-red-500 hover:text-red-700 font-bold text-sm"
                onClick={() => handleDeleteDepartment(dept._id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Add New Department:</label>
        <input
          type="text"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          className="border rounded px-2 py-1 mt-2 w-full"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => setNewDepartment('')}
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddDepartment}
          disabled={addDepartmentMutation.isLoading}
        >
          {addDepartmentMutation.isLoading ? 'Adding...' : 'Add Department'}
        </button>
      </div>
    </div>
  );
};

export default DepartmentManagement;
