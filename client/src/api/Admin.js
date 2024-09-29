import axios from "../utils/axiosConfig";

export const listReviews = async ({ rating }) => {
  try {
    const response = await axios.get(`/admin/reviews?rating=${rating}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Error fetching reviews");
  }
};

export const updateReviewStatus = async ({ review_id, status }) => {
  try {
    const response = await axios.post("/admin/status", {
      review_id,
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating review status:", error);
    throw new Error(
      error?.response?.data?.error || "Error updating review status"
    );
  }
};

export const deleteReview = async ({ reviewId }) => {
  try {
    const response = await axios.delete(`/admin/review/${reviewId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Error deleting review");
  }
};

export const addPlan = async ({ name, range, cost }) => {
  try {
    const response = await axios.post("/admin/plan", {
      name,
      range,
      cost,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Error adding plan");
  }
};

export const listPlans = async () => {
  try {
    const response = await axios.get("/admin/plans");
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Error fetching plans");
  }
};

export const deletePlan = async ({ planId }) => {
  try {
    const response = await axios.delete(`/admin/plan/${planId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Error deleting plan");
  }
};

export const listEnquiries = async ({ email }) => {
  try {
    const response = await axios.get(`/admin/enquirieslist?email=${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Error fetching enquiries");
  }
};

export const updateEnquiryStatus = async ({ enquiry_id, status }) => {
  try {
    const response = await axios.post("/admin/enquiriesstatus", {
      enquiry_id,
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    throw new Error(
      error?.response?.data?.error || "Error updating enquiry status"
    );
  }
};

export const deleteEnquiry = async ({ enquiryId }) => {
  try {
    const response = await axios.delete(`/admin/enquiry/${enquiryId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Error deleting review");
  }
};
