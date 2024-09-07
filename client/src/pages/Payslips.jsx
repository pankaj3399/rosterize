import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import {useMutation} from '@tanstack/react-query';
import { pdfSummary } from '../api/User';

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

const Payslips = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('January');
    const [hourlyRate, setHourlyRate] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [workSummary, setWorkSummary] = useState(null);
    const pdfMutation = useMutation({
      mutationFn: pdfSummary,
      onSuccess: (data)=> {

        try {
          const doc = new jsPDF();
          doc.text('Payslip Summary', 10, 10);
  
          let yPosition = 20;
          let totalSalary = 0;
  
          Object.keys(data).forEach(date => {
              const dailyHours = data[date].totalHoursWorked;
              const dailySalary = dailyHours * Number(hourlyRate);
              totalSalary += dailySalary;
  
              doc.text(`Date: ${date}`, 10, yPosition);
              doc.text(`Total Hours Worked: ${dailyHours}`, 10, yPosition + 10);
              doc.text(`Salary Earned: $${dailySalary.toFixed(2)}`, 10, yPosition + 20);
              yPosition += 30;
          });
  
          doc.text(`Total Salary: $${totalSalary.toFixed(2)}`, 10, yPosition + 10);
  
          doc.save('payslip.pdf');
  
        } catch (error) {
          console.error('Error fetching work summary:', error.message);
        }
      },
      onError: (error) => {
        setMessage('');
        setError('Error downloading payslip', error.message);
      }
    })

    const handleDownload = async () => {
        if (selectedPeriod) {
            try {
              
              if(!hourlyRate || hourlyRate == '' || hourlyRate == 0) {
                alert('Please enter hourly rate');
                return;
              }
              pdfMutation.mutate(monthToFromToDate(selectedPeriod));
            } catch (error) {
                console.error('Error fetching work summary:', error.message);
            }
        } else {
            alert('Please select a pay period first.');
        }
    };

    return (
        <div className="p-4 w-full max-w-4xl mx-auto bg-white rounded-lg shadow">
          <div className='flex justify-between'>
            <h2 className="text-2xl font-bold mb-4">Payslips</h2>
            <input type="number" placeholder="Hourly Rate" className="w-[200px]" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} required/>
          </div>
            <div className="p-4 border rounded-lg">
                <label className="block text-lg font-semibold mb-2">
                    Select Pay Period:
                </label>
                <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                >
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
                <button
                    onClick={handleDownload}
                    className="w-full py-2 bg-blue-800 text-white font-semibold rounded hover:bg-blue-900"
                    disabled={pdfMutation.isPending}
                >
                    {pdfMutation.isPending ? 'Downloading...' : 'Download Payslip'}
                </button>
            </div>
        </div>
    );
};

export default Payslips;
