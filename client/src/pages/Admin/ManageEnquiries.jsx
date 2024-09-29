import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from "../../api/Admin";
import Loader from "../../Components/Loader/Loader";
import { CheckCircle, XCircle } from "lucide-react";

const ManageCustomerEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setEmail(searchEmail);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchEmail]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["enquiries", { email }],
    queryFn: async () => listEnquiries({ email }),
    retry: 0,
  });

  const statusMutation = useMutation({
    mutationFn: updateEnquiryStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["enquiries"]);
    },
    onError: (error) => {
      console.error("Failed to update review status:", error);
    },
  });

  useEffect(() => {
    if (data) {
      setEnquiries(data);
    }
  }, [data]);

  const changeStatus = (enquiry_id, status) => {
    statusMutation.mutate({ enquiry_id, status });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteEnquiry,
    onSuccess: () => {
      queryClient.invalidateQueries(["enquiries"]);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      console.error("Failed to delete review:", error);
    },
  });

  const handleDelete = (enquiry_id) => {
    deleteMutation.mutate({ enquiryId: enquiry_id });
  };

  if (isLoading) return <Loader />;
  if (isError) return <div>Error fetching customers</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Enquries</h2>
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
        {enquiries &&
          enquiries.length > 0 &&
          enquiries.map(
            (enquiry) =>
              enquiry.status === "completed" && (
                <div key={enquiry._id} className="border p-4 rounded-lg">
                  <div className="flex">
                    <div className="w-full">
                      <p>Contact Name: {enquiry.name}</p>
                      <p>Contact Email: {enquiry.email}</p>
                      <p>Company Name: {enquiry.company}</p>
                      <p>Subject: {enquiry.subject}</p>
                      <p>Message: {enquiry.message}</p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <button
                        className="text-green-500 text-2xl "
                        onClick={() => changeStatus(enquiry._id, "completed")}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </button>
                      <button
                        className="text-red-500 text-2xl"
                        onClick={() => handleDelete(enquiry._id)}
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              )
          )}
      </div>
      {statusMutation.isError && (
        <div className="text-red-500">Error updating status</div>
      )}
      {statusMutation.isSuccess && (
        <div className="text-green-500">Status updated successfully</div>
      )}
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default ManageCustomerEnquiries;
