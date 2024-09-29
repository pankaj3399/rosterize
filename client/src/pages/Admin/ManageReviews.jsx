import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listReviews, updateReviewStatus, deleteReview } from "../../api/Admin";
import Loader from "../../Components/Loader/Loader";

const ManageCustomerRatings = () => {
  const [selectedRating, setSelectedRating] = useState("");
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedRating && selectedRating !== "") {
        queryClient.invalidateQueries(["ratings", { rating: selectedRating }]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [selectedRating]);

  const {
    isLoading,
    isError,
    data: reviews,
  } = useQuery({
    queryKey: ["ratings", { rating: selectedRating }],
    queryFn: () => listReviews({ rating: selectedRating }),
    retry: 0,
  });

  const statusMutation = useMutation({
    mutationFn: updateReviewStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["ratings"]);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      console.error("Failed to update review status:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(["ratings"]);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      console.error("Failed to delete review:", error);
    },
  });

  const changeStatus = (review_id, status) => {
    statusMutation.mutate({ review_id, status });
  };

  const handleDelete = (review_id) => {
    deleteMutation.mutate({ reviewId: review_id });
  };

  if (isLoading) return <Loader />;
  // if (isError) return <div>Error fetching customers</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Customer Ratings</h2>
      <div className="mb-4">
        <select
          className="border p-2 w-full"
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
        >
          <option value="">Select Rating</option>
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews &&
          reviews.length > 0 &&
          reviews.map((review) => (
            <div key={review._id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-bold">{review?.company?.name}</h3>
              {review?.user?.firstName && review?.user?.lastName ? (
                <>
                  <p>First Name: {review?.user?.firstName}</p>
                  <p>Last Name: {review?.user?.lastName}</p>
                </>
              ) : (
                <p>Name: {review?.company?.name}</p>
              )}
              <p>Email: {review?.user?.email}</p>
              <p>
                Role: {review.user?.companyRole?.name || review?.user?.role}
              </p>
              <p>Company: {review?.company?.name}</p>
              <p>Rating: {review.rating}</p>
              <p>Title: {review.title}</p>
              <p>Message: {review.review}</p>

              <div className="flex mt-4">
                {review?.status === "inactive" ? (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => changeStatus(review._id, "active")}
                  >
                    {statusMutation.isPending ? "Selecting..." : "Select ✓"}
                  </button>
                ) : (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => changeStatus(review._id, "inactive")}
                  >
                    {statusMutation.isPending ? "Hiding..." : "Hide ✗"}
                  </button>
                )}
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded"
                  onClick={() => handleDelete(review._id)}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default ManageCustomerRatings;
