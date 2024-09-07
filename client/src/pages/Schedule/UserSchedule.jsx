import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getClockInFromToDate, getLeaves, handleDownload } from '../../api/User';
import { format } from 'date-fns';
import Loader from '../../Components/Loader/Loader';


const extractTime = (isoDateStr) => {
  const date = new Date(isoDateStr);
  
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

const Schedule = () => {
  const monthToFromToDate = (month) => {
    const currentYear = new Date().getFullYear();
    switch (month) {
      case 'January':
        return { from: `${currentYear}-01-01`, to: `${currentYear}-01-31` };
      case 'February':
        return { from: `${currentYear}-02-01`, to: `${currentYear}-02-29` }; // Consider leap year
      case 'March':
        return { from: `${currentYear}-03-01`, to: `${currentYear}-03-31` };
      case 'April':
        return { from: `${currentYear}-04-01`, to: `${currentYear}-04-30` };
      case 'May':
        return { from: `${currentYear}-05-01`, to: `${currentYear}-05-31` };
      case 'June':
        return { from: `${currentYear}-06-01`, to: `${currentYear}-06-30` };
      case 'July':
        return { from: `${currentYear}-07-01`, to: `${currentYear}-07-31` };
      case 'August':
        return { from: `${currentYear}-08-01`, to: `${currentYear}-08-31` };
      case 'September':
        return { from: `${currentYear}-09-01`, to: `${currentYear}-09-30` };
      case 'October':
        return { from: `${currentYear}-10-01`, to: `${currentYear}-10-31` };
      case 'November':
        return { from: `${currentYear}-11-01`, to: `${currentYear}-11-30` };
      case 'December':
        return { from: `${currentYear}-12-01`, to: `${currentYear}-12-31` };
      default: // January
        return { from: `${currentYear}-01-01`, to: `${currentYear}-01-31` };
    }
  };

  const [selectedMonth, setSelectedMonth] = useState('January');

  const { isLoading, error, data } = useQuery({
    queryKey: ['schedule', selectedMonth],
    queryFn: () => getClockInFromToDate(monthToFromToDate(selectedMonth)),
    enabled: !!selectedMonth,
  });

  const { data: leavesData, isLoading: leavesLoading, isError: leavesError } = useQuery({
    queryKey: ['leaves', selectedMonth],
    queryFn: () => getLeaves({ status: 'approved', ...monthToFromToDate(selectedMonth) }),
  });

  const downloadDataMutation = useMutation({
    mutationFn: handleDownload,
    onSuccess: (data) => {
      const blob = new Blob([data.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Schedule_${selectedMonth}_${new Date().getFullYear()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    }
  })

  if (isLoading || leavesLoading) return <Loader />;
  if (error || leavesError) return <div>Error loading schedule or leaves.</div>;

  const mapDataToSchedule = (data) => {
    const schedule = {};
    data.forEach(entry => {
      const date = new Date(entry.clockIn).getDate();
      schedule[date] = `${extractTime(entry.clockIn)} - ${extractTime(entry.clockOut)}`;
    });
    return schedule;
  };

  const mapLeavesToSchedule = (leavesData) => {
    console.log("leavesData", leavesData);
    const leaves = {};
    leavesData.forEach(entry => {
      const startDate = new Date(entry.startDate).getDate();
      const endDate = new Date(entry.endDate).getDate();
      const leaveTypeAbbreviation = entry.leaveType === 'annual' ? 'AL' : 'ML';

      for (let i = startDate; i <= endDate; i++) {
        leaves[i] = leaveTypeAbbreviation;
      }
    });
    return leaves;
  };

  const scheduleData = mapDataToSchedule(data);
  const leavesSchedule = mapLeavesToSchedule(leavesData && Array.isArray(leavesData) ? leavesData : []);

  const currentYear = new Date().getFullYear();
  const monthIndex = new Date(`${selectedMonth} 1, ${currentYear}`).getMonth();
  const firstDayOfMonth = new Date(currentYear, monthIndex, 1);
  const lastDayOfMonth = new Date(currentYear, monthIndex + 1, 0);

  const startDay = firstDayOfMonth.getDay();
  const totalDaysInMonth = lastDayOfMonth.getDate();

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push({ day: null, status: '' }); // Empty cells before the 1st day
  }
  for (let i = 1; i <= totalDaysInMonth; i++) {
    const leaveStatus = leavesSchedule[i];
    const dayStatus = leaveStatus || scheduleData[i] || 'OFF';
    calendarDays.push({
      day: i,
      status: dayStatus,
      isLeave: !!leaveStatus,
    });
  }

  const downloadExcel = () => {
    downloadDataMutation.mutate(calendarDays);
  }


  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Schedule</h1>

      <div className="flex items-center mb-6">
        <label className="mr-4">Select Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="" disabled>Select month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
        <button className="ml-4 bg-blue-900 text-white py-2 px-4 rounded shadow" onClick={downloadExcel}>
          Download
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
          <div key={index} className="text-center font-bold">
            {day}
          </div>
        ))}

        {calendarDays.map((entry, index) => (
          <div
            key={index}
            className={`text-center p-4 border ${
              entry.isLeave
                ? 'border-blue-500 text-blue-500'
                : entry.status === 'OFF'
                ? 'border-red-500 text-red-500'
                : entry.status !== ''
                ? 'border-gray-500 text-gray-900'
                : 'border-transparent'
            }`}
          >
            {entry.day !== null && <div>{entry.day}</div>}
            <div>{entry.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
