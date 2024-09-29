import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { searchUser, updateUser } from "../../api/User";
import { listDepartments } from "../../api/Department";
import { listRoles } from "../../api/Role";
import Loader from "../../Components/Loader/Loader";
import { useAuth } from "../../context/AuthContext";

const Users = () => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { authData } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["users", searchTerm],
    queryFn: () =>
      searchUser({ email: searchTerm, departmenthead_id: authData._id }),
  });

  const { data: departmentData, isLoading: departmentLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: () => listDepartments(authData.company),
    enabled: !!authData.company,
  });

  const { data: roleData, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => listRoles(authData.company),
    enabled: !!authData.company,
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      setMessage("User updated successfully");
      setError("");
    },
    onError: (error) => {
      setMessage("");
      setError(error.message);
    },
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleBackClick = () => {
    setSelectedUser(null);
  };

  const handleUpdate = () => {
    const userId = selectedUser._id;
    const userData = {
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      email: selectedUser.email,
      phoneNo: selectedUser.phoneNo,
      emergencyContactName: selectedUser.emergencyContactName,
      emergencyContactNo: selectedUser.emergencyContactNo,
      employeeId: selectedUser.employeeId,
      companyRole: selectedUser.companyRole._id,
      department: selectedUser.department._id,
      role: selectedUser.role,
    };
    const payload = { id: userId, user: userData };
    updateUserMutation.mutate(payload);
  };

  // This function updates only the _id while keeping the rest of the department object intact
  const handleDepartmentChange = (e) => {
    const selectedDepartment = departmentData.find(
      (dep) => dep._id === e.target.value
    );
    setSelectedUser({
      ...selectedUser,
      department: selectedDepartment,
    });
  };

  // This function updates only the _id while keeping the rest of the companyRole object intact
  const handleRoleChange = (e) => {
    const selectedRole = roleData.find((role) => role._id === e.target.value);
    setSelectedUser({
      ...selectedUser,
      companyRole: selectedRole,
    });
  };

  if (isLoading || departmentLoading || rolesLoading) return <Loader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-screen-lg mx-auto">
      {selectedUser ? (
        <div>
          <button
            onClick={handleBackClick}
            className="mb-4 p-2 text-blue-500 hover:underline"
          >
            {"< Back to list"}
          </button>
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Employee Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">First Name:</label>
                <input
                  type="text"
                  value={selectedUser.firstName}
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block font-medium">Last Name:</label>
                <input
                  type="text"
                  value={selectedUser.lastName}
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block font-medium">Email:</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-medium">
                  Emergency Contact Name:
                </label>
                <input
                  type="text"
                  value={selectedUser.emergencyContactName}
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      emergencyContactName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block font-medium">
                  Emergency Contact No:
                </label>
                <input
                  type="text"
                  value={selectedUser.emergencyContactNo}
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      emergencyContactNo: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block font-medium">Phone Number:</label>
                <input
                  type="text"
                  value={selectedUser.phoneNo}
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      phoneNo: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <h2 className="text-xl font-semibold mt-6 mb-6">
              Employment Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Employee ID:</label>
                <input
                  type="text"
                  value={selectedUser.employeeId}
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      employeeId: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block font-medium">Department:</label>
                <select
                  value={selectedUser.department._id}
                  className="w-full p-2 border rounded"
                  onChange={handleDepartmentChange}
                >
                  {departmentData.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium">Role:</label>
                <select
                  value={selectedUser.companyRole._id}
                  className="w-full p-2 border rounded"
                  onChange={handleRoleChange}
                >
                  {roleData.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleUpdate}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? "Updating..." : "Update"}
            </button>
          </div>
          {message && <p className="text-green-500 mt-4">{message}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Employee Profile - Search User
          </h2>
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="To search, key in email"
              className="w-full sm:w-1/2 p-2 border rounded"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data &&
              data.length > 0 &&
              data.map((user) => (
                <div
                  key={user.id}
                  className="bg-white shadow-md rounded p-4 cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <p>
                    <strong>Name:</strong>{" "}
                    {user.firstName + " " + user.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Department:</strong> {user?.department?.name}
                  </p>
                  <p>
                    <strong>Role:</strong> {user?.companyRole?.name}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
