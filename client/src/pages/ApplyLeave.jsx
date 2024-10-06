import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { applyLeave } from "../api/User";

const ApplyLeave = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const applyLeaveMutation = useMutation({
    mutationFn: applyLeave,
    onSuccess: () => {
      document.getElementById("leaveType").value = "";
      document.getElementById("fromDate").value = "";
      document.getElementById("toDate").value = "";
      document.getElementById("note").value = "";
      setError("");
      setMessage("Leave applied successfully");
    },
    onError: (error) => {
      setMessage("");
      setError(error.message);
    },
  });

  const submitLeave = (e) => {
    e.preventDefault();
    const leaveType = document.getElementById("leaveType").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const note = document.getElementById("note").value;

    applyLeaveMutation.mutate({
      from: fromDate,
      to: toDate,
      reason: note,
      type: leaveType,
    });
  };

  return (
    <div className="p-8 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-6">Manage Leave</h1>
      <div className="bg-gray-100 p-6 rounded-md shadow">
        <form>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="leaveType"
            >
              Leave Type:
            </label>
            <select
              id="leaveType"
              className="block w-full bg-white border border-gray-300 rounded-md p-2"
              required
            >
              <option value="" disabled selected>
                Select
              </option>
              <option value="medical">Medical Leave</option>
              <option value="annual">Annual Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="fromDate"
              >
                From:
              </label>
              <input
                type="date"
                id="fromDate"
                className="block w-full bg-white border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="toDate"
              >
                To:
              </label>
              <input
                type="date"
                id="toDate"
                className="block w-full bg-white border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="note"
            >
              Note:
            </label>
            <textarea
              id="note"
              rows="4"
              className="block w-full bg-white border border-gray-300 rounded-md p-2"
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-800 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
              onClick={(e) => submitLeave(e)}
            >
              Submit
            </button>
          </div>
        </form>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {message && <div className="text-green-500 mt-4">{message}</div>}
      </div>
    </div>
  );
};

export default ApplyLeave;
