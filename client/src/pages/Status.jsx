import React, { useEffect, useState } from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { getAllStatusMessages, setStatus, getStatus } from '../api/User';
import Loader from '../Components/Loader/Loader.jsx';

const StatusPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMessage, setSelectedMessage] = useState('');

  const { data: statuses, isLoading, error } = useQuery({
    queryKey: 'statuses',
    queryFn: () => getAllStatusMessages()
  });

  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: 'status',
    queryFn: () => getStatus()
  });

  useEffect(() => {

    console.log('status', status);
    if (status) {
      setSelectedStatus(status.status);
      setSelectedMessage(status.message);
    }

  }, [status]);

  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: setStatus,
    onSuccess: () => {
      queryClient.invalidateQueries('statuses');
    }
  })


  const handleUpdate = () => {
    if (selectedStatus) {
      statusMutation.mutate({status: selectedStatus, message: selectedMessage});
    }
  };

  const handleRemove = () => {
    setSelectedStatus('');
  };

  if(isLoading || statusLoading) return <Loader />;
  return (
    <div className="p-8 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-6">Status</h1>
      <div className="bg-gray-100 p-6 rounded-md shadow">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="setStatus">
            Set Status:
          </label>
          <select
            id="setStatus"
            className="block w-full bg-white border border-gray-300 rounded-md p-2"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="" disabled>Select</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div className="flex justify-between mb-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-800 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
            disabled={!statusMutation.isPending && !selectedStatus} 
          >
            {statusMutation.isPending ? 'Updating...' : 'Update'}
          </button>
          <button
            onClick={handleRemove}
            className="bg-red-600 text-white px-6 py-2 rounded-md shadow hover:bg-red-500 transition duration-200"
          >
            Remove
          </button>
        </div>

        <div className="mb-4">
          {/* input field for message */}
          <label className="block text-gray-700 font-bold mb-2" htmlFor="message">
            Message:
          </label>
          <textarea
            id="message"
            className="block w-full bg-white border border-gray-300 rounded-md p-2"
            rows="3"
            value={selectedMessage}
            onChange={(e) => setSelectedMessage(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Past Status:
          </label>
          <ul className="bg-white border border-gray-300 rounded-md p-4">
            {statuses && statuses.map((status, index) => (
              <li key={index} className="mb-2 p-2 border-b last:border-b-0">{status}</li>
            ))}
          </ul>
        </div>
        {statusMutation.isError && <div className="text-red-600 mt-4">{statusMutation.error.message}</div>}
        {statusMutation.isSuccess && <div className="text-green-600 mt-4">Status updated successfully</div>}
      </div>
    </div>
  );
};

export default StatusPage;
