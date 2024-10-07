import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { changeLeaveStatus, getLeaves } from "../../api/Hod";
import Loader from "../../Components/Loader/Loader";

const ApproveRejectLeaves = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["leaves"],
    queryFn: () => getLeaves("pending"),
  });

  const changeStatusMutation = useMutation({
    mutationFn: changeLeaveStatus,
    onSuccess: () => {
      setError("");
      setMessage("Leave status updated successfully");
      queryClient.invalidateQueries("leaves");
    },
    onError: (error) => {
      setMessage("");
      setError(error.message);
    },
  });

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleApprove = (leave_id) => {
    changeStatusMutation.mutate({ id: leave_id, status: "approved" });
  };

  const handleReject = (leave_id) => {
    changeStatusMutation.mutate({ id: leave_id, status: "rejected" });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Approve/Reject Leaves</h2>
      <div className="border p-4 bg-gray-50">
        <h3 className="font-semibold">Inbox:</h3>
        <ul>
          {data && data.length > 0 ? (
            data.map((request) => (
              <li
                key={request._id}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>
                  {request.date}: Leave Request - {request.user.email}{" "}
                  {formatDate(request.startDate)}
                </span>
                <div>
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded mr-2"
                    onClick={() => handleApprove(request._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-1 rounded"
                    onClick={() => handleReject(request._id)}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No pending leave requests</li>
          )}
        </ul>
      </div>
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default ApproveRejectLeaves;
