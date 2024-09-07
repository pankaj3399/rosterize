// src/pages/Register.jsx
import { useNavigate } from 'react-router-dom';
import companyLogo from '../assets/rosterize.png'
// import { createCompany } from '../api/Company';
import { listPlansAndReviews, createCompany } from '../api/Public';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Loader from '../Components/Loader/Loader';

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: 'plansAndReviews',
    queryFn: () => listPlansAndReviews(),
  })

  const mutation = useMutation({
    mutationFn: createCompany,
    onSuccess: (data) => {
      navigate('/login');
    },
    onError: (error) => {
      console.error('Company creation failed:', error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target);
    const password = formData.get('password');
    const cnfpassword = formData.get('cnfpassword');

    if (password !== cnfpassword) {
      setError('Passwords do not match');
      return;
    }

    const data = Object.fromEntries(formData.entries());
    mutation.mutate(data);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="text-center mb-6">
          <img src={companyLogo} height='60px' width='60px' alt="Logo" className="mx-auto" />
          <h1 className="text-2xl font-bold">Register</h1>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Name" className="input" name='name' required/>
          <input type="email" placeholder="Email" className="input" name="email" required/>
          <input type="text" placeholder="Mobile Number" className="input" name="phone" required/>
          <input type="password" placeholder="Password" className="input" name="password" required/>
          <input type="password" placeholder="Confirm Password" className="input" name="cnfpassword" required/>
          <input type="text" placeholder="UEN" className="input" name="UEN" required/>
          <select
            id="employees"
            className="input"
            name="subscriptionPlan"
            required
          >
            {
              data?.plans.map((plan, idx) => (
                <option key={idx} value={plan._id}>{plan.range}</option>
              ))
            }
          </select>

          <input type="text" placeholder="Industry" className="input" name="industry" required/>
          <input type="text" placeholder="Website" className="col-span-2 input" name="website" required/>
          <textarea placeholder="Address" className="col-span-2 input" name="address" required></textarea>
          <textarea placeholder="Message" className="col-span-2 input" name="message" required></textarea>
        </div>
        <div className="flex justify-between mt-6">
          <button type="button" className="btn bg-gray-700 text-white" onClick={() => navigate(-1)}>Back</button>
          <button type="submit" className="btn bg-blue-600 text-white" disabled={mutation.isPending}>{
            mutation.isPending ? 'Creating Company...' : 'Create Company'
            }</button>
        </div>
        {(mutation.isError || error) && <p className="text-red-500 text-sm mt-2">{mutation?.error?.message || error}</p>}
      </form>
    </div>
  );
}
