import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { list, updateCompanyStatus } from '../../api/Company';
import Loader from '../../Components/Loader/Loader';

const ManageCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchEmail, setSearchEmail] = useState('');
    const [email, setEmail] = useState('');
    const queryClient = useQueryClient();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setEmail(searchEmail);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchEmail]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['companies', { email }],
        queryFn: async() => list({ email }),
        retry: 0,
    });

    const statusMutation = useMutation({
        mutationFn: updateCompanyStatus,
        onSuccess: (data) => {
            queryClient.invalidateQueries('companies');
        }
    });

    useEffect(() => {
        if (data) {
            setCustomers(data);
        }
    }, [data]);

    const changeStatus = (company_id, status) => {
        statusMutation.mutate({ company_id, status });
    };

    if (isLoading) return <Loader />;
    if (isError) return <div>Error fetching customers</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Customer</h2>
            <div className="mb-4">
                <input
                    type="text"
                    className="border p-2 w-full"
                    placeholder="To search, key in email"
                    value={searchEmail}
                    autoFocus
                    onChange={(e) => setSearchEmail(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customers && customers.length > 0 && customers.map((customer) => (
                    <div key={customer._id} className="border p-4 rounded-lg">
                        <h3 className="text-lg font-bold">{customer.company.name}</h3>
                        <p>Email: {customer.email}</p>
                        <p>UEN: {customer.company.UEN}</p>
                        <p>Industry: {customer.company.industry}</p>
                        <p>Contact Name: {customer.company.name}</p>
                        <p>Contact Email: {customer.email}</p>
                        <p>Contact Phone: {customer.company.phone}</p>
                        <p>Role: {customer.role}</p>
                        <p>Website: {customer.company.website}</p>
                        <p>Number of Employees: {customer?.company?.subscriptionPlan?.range}</p>
                            <div className="flex mt-4">
                            {
                              (customer.company.status === 'pending' || customer.company.status === 'rejected') ? (

                              <button 
                                  className="bg-green-500 text-white px-4 py-2 rounded mr-2" 
                                  onClick={() => { changeStatus(customer.company._id, 'approved') }}
                              >
                                {
                                  statusMutation.isPending ? 'Approving...' : 'Approve ✓'
                                }
                              </button>
                              ):(
                              <button 
                                  className="bg-red-500 text-white px-4 py-2 rounded" 
                                  onClick={() => { changeStatus(customer.company._id, 'rejected') }}
                              >

                                {statusMutation.isPending ? 'Rejecting...' : 'Reject ✕'}
                              </button>
                            )}
                            </div>
                          
                        
                    </div>
                ))}
            </div>
            {statusMutation.isError && <div className="text-red-500">Error updating status</div>}
            {statusMutation.isSuccess && <div className="text-green-500">Status updated successfully</div>}
        </div>
    );
};

export default ManageCustomers;
