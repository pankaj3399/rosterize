import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { clockIn, clockOut, getClockInOutStatus } from '../api/User';
import Loader from '../Components/Loader/Loader';

const utcToLocalTimeString = (utcTimeString) => {
  const utcDate = new Date(utcTimeString);

  const localHours = utcDate.getHours().toString().padStart(2, '0');
  const localMinutes = utcDate.getMinutes().toString().padStart(2, '0');

  const localTimeString = `${localHours}:${localMinutes}`;
  return localTimeString;
};

const extractTime = (isoDateStr) => {
  const date = new Date(isoDateStr);
  
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
};


const ClockInOut = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const queryClient = new QueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ['clockInOutStatus'],
    queryFn: getClockInOutStatus,
    onSuccess: (data) => {
      if (data.clockIn && !data.clockOut) {
        setIsClockedIn(true);
        setStartTime(extractTime(data.clockIn));
      } else if (data.clockIn && data.clockOut) {
        setIsClockedIn(false);
        setStartTime(extractTime(data.clockIn));
        setEndTime(extractTime(data.clockOut));
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const clockInMutation = useMutation({
    mutationFn: clockIn,
    onSuccess: () => {
      setIsClockedIn(true);
      setErrorMessage('');
      setSuccessMessage('Clocked in successfully');
    },
    onError: (error) => {
      setSuccessMessage('');
      setErrorMessage(error.message);
      console.error(error);
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: clockOut,
    onSuccess: () => {
      setIsClockedIn(false);
      setErrorMessage('');
      setSuccessMessage('Clocked out successfully');
    },
    onError: (error) => {
      setSuccessMessage('');
      setErrorMessage(error.message);
      console.error(error);
    },
  });

  const handleClockIn = () => {
    clockInMutation.mutate({ time: startTime });
  };

  const handleClockOut = () => {
    if (endTime < startTime) {
      setSuccessMessage('');
      return setErrorMessage('End time cannot be less than start time');
    }
    clockOutMutation.mutate({ time: endTime });
  };

  useEffect(() => {
    queryClient.invalidateQueries('clockInOutStatus');
    if (data) {
      if (data.clockIn && !data.clockOut) {
        setIsClockedIn(true);
        setStartTime(extractTime(data.clockIn));
      } else if (data.clockIn && data.clockOut) {
        setIsClockedIn(false);
        setStartTime(extractTime(data.clockIn));
        setEndTime(extractTime(data.clockOut));
      }
    }
  }, [data]);

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Clock In/Out</h1>

      <div className="bg-gray-100 rounded-lg p-6 shadow-md w-full md:w-1/2">
        <div className={`text-center p-4 border-2 ${isClockedIn ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
          {isClockedIn ? 'Clocked In' : 'Clocked Out'}
        </div>

        <div className="flex justify-between mt-6">
          <div className="flex flex-col items-start">
            <label className="mb-2">Shift Start Time:</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="p-2 border border-gray-300 rounded"
              disabled={isClockedIn}
            />
          </div>

          <div className="flex flex-col items-start">
            <label className="mb-2">Shift End Time:</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="p-2 border border-gray-300 rounded"
              disabled={!isClockedIn}
            />
          </div>
        </div>

        <div className="mt-6">
          {!isClockedIn ? (
            <button
              onClick={handleClockIn}
              className="w-full bg-blue-900 text-white py-2 px-4 rounded shadow"
            >
              {clockInMutation.isLoading ? 'Clocking In...' : 'Clock In'}
            </button>
          ) : (
            <button
              onClick={handleClockOut}
              className="w-full bg-blue-900 text-white py-2 px-4 rounded shadow"
            >
              {clockOutMutation.isLoading ? 'Clocking Out...' : 'Clock Out'}
            </button>
          )}
        </div>
      </div>
      {successMessage && <div className="mt-4 text-green-500">{successMessage}</div>}
      {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default ClockInOut;
