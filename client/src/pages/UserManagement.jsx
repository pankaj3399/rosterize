import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listDepartments, listDepartmentHeads } from "../api/Department";
import { listRoles } from "../api/Role";
import { listSkills } from "../api/Skill";

import { useAuth } from "../context/AuthContext";
import Loader from "../Components/Loader/Loader";
import { listUsers, createUser, deleteUser, searchUser } from "../api/User";

const UserManagement = () => {
  const { authData } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);

  const {
    data: departments,
    isLoading: loadingDepartments,
    error: errorDepartments,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: () => listDepartments(authData.company),
    enabled: !!authData.company,
    retry: 0,
  });

  const {
    data: skills,
    isLoading: loadingSkills,
    error: errorSkills,
  } = useQuery({
    queryKey: ["skills", authData.company],
    queryFn: () => listSkills(authData.company),
    retry: 0,
  });

  const {
    data: roles,
    isLoading: loadingRoles,
    error: errorRoles,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: () => listRoles(authData.company),
    enabled: !!authData.company,
    retry: 0,
  });

  const {
    data: usersData,
    isLoading: loadingUsers,
    error: errorUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => listUsers(authData.company),
    enabled: !!authData.company,
    retry: 0,
  });

  const searchUserMutation = useMutation({
    mutationFn: searchUser,
    onSuccess: (data) => {
      setUsers(data);
    },
    onError: (error) => {
      console.error("Search user failed:", error);
    },
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries("users");
      setMessage("User added successfully");
      setError("");
    },
    onError: (error) => {
      setMessage("");
      setError(error.message);
      console.error("Add user failed:", error);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      setMessage("User deleted successfully");
      setError("");
      queryClient.invalidateQueries("users");
    },
    onError: (error) => {
      setMessage("");
      setError(error.message);
      console.error("Delete user failed:", error);
    },
  });

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    companyRole: "",
    phoneNumber: "",
    role: "",
    primarySkill: "",
    secondarySkill: "",
    leaveEntitlement: "",
    departmentHead: "",
  });

  const {
    data: departmentHeads,
    isLoading: loadingDepartmentHeads,
    error: errorDepartmentHeads,
  } = useQuery({
    queryKey: ["departmentHeads", newUser.department],
    queryFn: () => listDepartmentHeads(authData.company, newUser.department),
    enabled: !!newUser.department && !!authData.company,
    retry: 0,
  });

  const handleAddUser = () => {
    console.log(newUser);
    if (
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.email ||
      !newUser.department ||
      !newUser.companyRole ||
      !newUser.phoneNumber ||
      !newUser.role ||
      !newUser.primarySkill ||
      !newUser.secondarySkill ||
      !newUser.leaveEntitlement
    ) {
      return alert("All fields are required");
    }
    createUserMutation.mutate({ ...newUser, company: authData.company });

    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      role: "",
      phoneNumber: "",
      companyRole: "",
      primarySkill: "",
      secondarySkill: "",
      leaveEntitlement: "",
      departmentHead: "",
    });
  };

  const handleDeleteUser = (userId) => {
    deleteUserMutation.mutate(userId);
  };

  useEffect(() => {
    // debounce search
    const timeoutId = setTimeout(() => {
      searchUserMutation.mutate({ email, user: authData.company });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [email]);

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  if (loadingDepartments || loadingRoles) return <Loader />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">
            User First Name:
          </label>
          <input
            className="border p-2 rounded w-full"
            value={newUser.firstName}
            onChange={(e) =>
              setNewUser({ ...newUser, firstName: e.target.value })
            }
            required
          />

          <label className="block text-sm font-medium mb-1 mt-4">
            Email Address:
          </label>
          <input
            className="border p-2 rounded w-full"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />

          <label className="block text-sm font-medium mb-1 mt-4">
            Department:
          </label>
          <select
            className="border p-2 rounded w-full"
            required
            value={newUser.department}
            onChange={(e) =>
              setNewUser({ ...newUser, department: e.target.value })
            }
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department._id} value={department._id}>
                {department.name}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium mb-1 mt-4">
            Department Head:
          </label>
          <select
            className="border p-2 rounded w-full"
            value={newUser.role}
            onChange={(e) => {
              if (e.target.value === "user") {
                setNewUser({
                  ...newUser,
                  role: e.target.value,
                });
              } else {
                setNewUser({
                  ...newUser,
                  role: e.target.value,
                  departmentHead: null,
                });
              }
            }}
            required
          >
            <option value="">Department Head</option>
            <option value="departmenthead">Yes</option>
            <option value="user">No</option>
          </select>

          {newUser.role !== "departmenthead" && newUser.role !== "" && (
            <>
              <label className="block text-sm font-medium mb-1 mt-4">
                Select Department Head:
              </label>
              <select
                className="border p-2 rounded w-full"
                value={newUser.departmentHead}
                onChange={(e) =>
                  setNewUser({ ...newUser, departmentHead: e.target.value })
                }
                required
              >
                <option value="">Select Department Head</option>
                {loadingDepartmentHeads ? (
                  <option>Loading department heads...</option>
                ) : departmentHeads?.length === 0 ? (
                  <option disabled>No department heads available</option>
                ) : (
                  departmentHeads?.map((head) => (
                    <option key={head._id} value={head._id}>
                      {head.firstName} {head.lastName}
                    </option>
                  ))
                )}
              </select>
            </>
          )}

          <label className="block text-sm font-medium mb-1 mt-4">
            Leave Entitlement: (Key in Number Only)
          </label>
          <input
            className="border p-2 rounded w-full"
            value={newUser.leaveEntitlement}
            onChange={(e) =>
              setNewUser({ ...newUser, leaveEntitlement: e.target.value })
            }
            required
            type="number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            User Last Name:
          </label>
          <input
            className="border p-2 rounded w-full"
            value={newUser.lastName}
            onChange={(e) =>
              setNewUser({ ...newUser, lastName: e.target.value })
            }
            required
          />

          <label className="block text-sm font-medium mb-1 mt-4">Role:</label>
          <select
            className="border p-2 rounded w-full"
            value={newUser.companyRole}
            onChange={(e) =>
              setNewUser({ ...newUser, companyRole: e.target.value })
            }
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium mb-1 mt-4">
            Phone Number:
          </label>
          <input
            className="border p-2 rounded w-full"
            value={newUser.phoneNumber}
            onChange={(e) =>
              setNewUser({ ...newUser, phoneNumber: e.target.value })
            }
            required
          />

          <label className="block text-sm font-medium mb-1 mt-4">
            Primary Skill:
          </label>
          <select
            className="border p-2 rounded w-full"
            required
            value={newUser.primarySkill}
            onChange={(e) =>
              setNewUser({ ...newUser, primarySkill: e.target.value })
            }
          >
            <option value="">Select Primary Skill</option>
            {skills
              ?.filter((skill) => skill._id !== newUser.secondarySkill)
              ?.map((skill) => (
                <option key={skill._id} value={skill._id}>
                  {skill.name}
                </option>
              ))}
          </select>

          <label className="block text-sm font-medium mb-1 mt-4">
            Secondary Skill:
          </label>
          <select
            className="border p-2 rounded w-full"
            required
            value={newUser.secondarySkill}
            onChange={(e) =>
              setNewUser({ ...newUser, secondarySkill: e.target.value })
            }
          >
            <option value="">Select Secondary Skill</option>
            {skills
              ?.filter((skill) => skill._id !== newUser.primarySkill)
              ?.map((skill) => (
                <option key={skill._id} value={skill._id}>
                  {skill.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleAddUser}
        className="bg-blue-700 text-white p-2 rounded w-full lg:w-1/4"
        disabled={createUserMutation.isPending}
      >
        {createUserMutation.isPending ? "Adding User..." : "Add User"}
      </button>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Search User</h3>
        <input
          type="text"
          placeholder="To search or delete user, key in email"
          className="border p-2 rounded w-full"
          onChange={(e) => {
            e.preventDefault();
            setEmail(e.target.value);
          }}
        />

        <div className="mt-4">
          {(email ? users : usersData) &&
          (email ? users : usersData).length == 0 ? (
            <p>No user found</p>
          ) : null}

          {(email ? users : usersData)?.map((user) => (
            <div
              key={user.email}
              className="flex justify-between items-center border p-2 rounded mb-2"
            >
              <div>
                <p className="text-sm">
                  <strong>Name:</strong> {user.firstName} {user.lastName}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-sm">
                  <strong>Department:</strong> {user?.department?.name}
                </p>
                <p className="text-sm">
                  <strong>Role:</strong> {user?.companyRole?.name}
                </p>
                <p className="text-sm">
                  <strong>Department Head:</strong>
                  {user?.role === "departmenthead" ? " Yes" : " No"}
                </p>
                <p className="text-sm">
                  <strong>Department Head Name: </strong>
                  {user?.departmentHead !== null
                    ? user?.departmentHead?.firstName +
                      " " +
                      user?.departmentHead?.lastName
                    : " - "}
                </p>
                <p className="text-sm">
                  <strong>Primary Skill:</strong> {user?.primarySkill?.name}
                </p>
                <p className="text-sm">
                  <strong>Secondary Skill:</strong> {user?.secondarySkill?.name}
                </p>
                {/* <p className="text-sm">
                  <strong>Leave Entitlement :</strong> {user?.leaveEntitlement}
                </p> */}
              </div>
              {
                // user.role == 'user' &&
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="text-red-500 text-xl"
                >
                  &times;
                </button>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
