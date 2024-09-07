import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { getUser, updateUser } from '../../api/User';
import Loader from '../../Components/Loader/Loader';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    emergencyContactName: '',
    emergencyContactNo: '',
    department: '',
    role: '',
    employeeId: '',
  });

  const { authData } = useAuth();
  const queryClient = new QueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['userData'],
    queryFn: () => getUser(authData._id),
    enabled: !!authData._id,    
    cacheTime: 0,
    retry: 0,
  });

  useEffect(() => {
    if(data) {
      setProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNo: data.phoneNo,
        emergencyContactName: data.emergencyContactName,
        emergencyContactNo: data.emergencyContactNo,
        department: data.department,
        companyRole: data.companyRole,
        employeeId: data.employeeId,
      });
    }
  }, [data]);

  useEffect(() => {
    console.log('profile', profile);
  }, [profile]);

  const updateUserMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: (data) => {
            setErrorMessage('');
            setSuccessMessage('User updated successfully');
            queryClient.invalidateQueries('userData');
        },
        onError: (error) => {
            setSuccessMessage('');
            setErrorMessage(error.message);
        }
    });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = () => {

    const user = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phoneNo: profile.phoneNo,
        emergencyContactName: profile.emergencyContactName,
        emergencyContactNo: profile.emergencyContactNo,
    };

    setProfile(user);

    updateUserMutation.mutate({id: authData._id, user});
  };

  const handleCancel = () => {
    // Add logic to reset or cancel changes
    setProfile({
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      emergencyContactName: '',
      emergencyContactNo: '',
    });
  };

  if(isLoading) return <Loader />;

  return (
    <div className="p-8 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-gray-100 p-6 rounded-md shadow">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="firstName">
              First Name:
            </label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              className="block w-full bg-white border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="lastName">
              Last Name:
            </label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              className="block w-full bg-white border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="block w-full bg-white border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="phoneNo">
              Phone Number:
            </label>
            <input
              type="tel"
              name="phoneNo"
              value={profile.phoneNo}
              onChange={handleChange}
              className="block w-full bg-white border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="emergencyContactName">
              Emergency Contact Name:
            </label>
            <input
              type="text"
              name="emergencyContactName"
              value={profile.emergencyContactName}
              onChange={handleChange}
              className="block w-full bg-white border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="emergencyContactNo">
              Emergency Contact Number:
            </label>
            <input
              type="tel"
              name="emergencyContactNo"
              value={profile?.emergencyContactNo}
              onChange={handleChange}
              className="block w-full bg-white border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Employment Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="role">
              Role/Position:
            </label>
            <input
              type="text"
              name="role"
              value={profile?.companyRole?.name}
              onChange={handleChange}
              className="block w-full bg-white border border-gray-300 rounded-md p-2"
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="department">
              Department:
            </label>
            <input
              type="text"
              name="department"
              value={profile?.department?.name}
              onChange={handleChange}
              className="block w-full bg-white border border-gray-300 rounded-md p-2"
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="employeeId">
              Employee ID:
            </label>
            <input
              type="text"
              name="employeeId"
              value={data.employeeId}
              onChange={handleChange}
              className="block w-full bg-white border border-gray-300 rounded-md p-2"
              disabled
            />
          </div>

        </div>
      </div>
        <div className="flex justify-evenly mt-5">
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
          {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

    </div>
  );
};

export default UserProfile;
