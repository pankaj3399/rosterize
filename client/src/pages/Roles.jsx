import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createRole, listRoles, removeRole } from '../api/Role';
import { useAuth } from '../context/AuthContext';
import Loader from '../Components/Loader/Loader';

const RoleManagement = () => {

    const [newRole, setNewRole] = useState('');
    const { authData } = useAuth();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['roles'],
        queryFn: () => listRoles(authData.company),
        enabled: !!authData.company,
        retry: 0,
    });

    const addRoleMutation = useMutation({
        mutationFn: createRole,
        onSuccess: (data) => {
            queryClient.invalidateQueries('roles');
        },
        onError: (error) => {
            console.error('Add role failed:', error);
        },
    });

    const deleteRoleMutation = useMutation({
        mutationFn: removeRole,
        onSuccess: (data) => {
            queryClient.invalidateQueries('roles');
        },
        onError: (error) => {
            console.error('Delete role failed:', error);
        },
    });

    const addRole = () => {
        if (newRole.trim() !== '') {
            addRoleMutation.mutate({ name: newRole, companyId: authData.company });
            setNewRole('');
        }
    };

    const deleteRole = (roleId) => {
        deleteRoleMutation.mutate(roleId);
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Role Management</h2>
            <div className="mb-4">
                <label className="block font-bold mb-2">List of Roles:</label>
                <ul className="border rounded-md p-2 max-h-40 overflow-y-auto">
                    {data?.map((role, index) => (
                        <li key={index} className="flex justify-between items-center mb-2">
                            {role.name}
                            <button
                                onClick={() => deleteRole(role._id)}
                                className="text-red-500 hover:text-red-700 font-bold text-sm"
                            >
                                x
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-4">
                <label className="block font-bold mb-2">Add New Role:</label>
                <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="border rounded-md p-2 w-full"
                />
            </div>
            <div className="flex justify-end">
                <button
                    onClick={addRole}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md mr-2"
                >
                    Save Changes
                </button>
                <button
                    onClick={() => setNewRole('')}
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-md"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default RoleManagement;
