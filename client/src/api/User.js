import axios from "../utils/axiosConfig";

const formatCalendarDataForExcel = (calendarDays) => {
  const formattedData = calendarDays.map((entry) => ({
    day: entry.day || "N/A",
    status: entry.status || "OFF",
  }));

  return formattedData;
};

export const createUser = async (user) => {
  try {
    const response = await axios.post("/user/create", user);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error || error.message || "Failed to create user"
    );
  }
};

export const getUser = async (id) => {
  try {
    const response = await axios.get(`/user/get/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to get user"
    );
  }
};

export const updateUser = async ({ id, user }) => {
  try {
    const response = await axios.post(`/user/update/${id}`, user);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to update user"
    );
  }
};

export const searchUser = async ({ email, departmenthead_id }) => {
  try {
    const response = await axios.get(`/user/search`, {
      params: {
        email,
        departmenthead_id,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to search user"
    );
  }
};

export const listUsers = async () => {
  try {
    const response = await axios.get("/user/list");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to list users"
    );
  }
};

export const listUnderHOD = async () => {
  try {
    const response = await axios.get("/user/listUnderHOD");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to list users"
    );
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`/user/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to delete user"
    );
  }
};

export const clockIn = async ({ time }) => {
  try {
    const payload = { clockInTime: time };
    const response = await axios.post(`/user/clockin`, payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to check in"
    );
  }
};

export const clockOut = async ({ time }) => {
  try {
    const payload = { clockOutTime: time };
    const response = await axios.post(`/user/clockout`, payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to check out"
    );
  }
};

export const getClockInOutStatus = async () => {
  try {
    const response = await axios.get("/user/loginstatus");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to get clock in/out status"
    );
  }
};

export const getClockInFromToDate = async ({ from, to }) => {
  try {
    const response = await axios.get(
      `/user/getclockinfromtodate?from=${from}&to=${to}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to get clock in/out status"
    );
  }
};

export const getAllStatusMessages = async () => {
  try {
    const response = await axios.get(`/user/getallstatusmessages`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to get all status messages"
    );
  }
};

export const setStatus = async ({ status, message }) => {
  try {
    const response = await axios.post(`/user/setstatus`, { status, message });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to set status"
    );
  }
};

export const getStatus = async () => {
  try {
    const response = await axios.get(`/user/getstatus`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to get status"
    );
  }
};

export const applyLeave = async ({ from, to, reason, type }) => {
  try {
    const response = await axios.post(`/user/applyleave`, {
      from,
      to,
      reason,
      type,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(
      error?.response?.data || error.message || "Failed to apply leave"
    );
  }
};

export const getLeaves = async ({ from, to, status }) => {
  try {
    const response = await axios.get(
      `/user/getleaves?from=${from}&to=${to}&status=${status}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to get leaves"
    );
  }
};

export const submitReview = async ({ title, review, rating }) => {
  try {
    const response = await axios.post(`/user/submitreview`, {
      title,
      review,
      rating,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to submit review"
    );
  }
};

export const Dashboard = async () => {
  try {
    const response = await axios.get("/user/dashboard");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to get dashboard data"
    );
  }
};

export const handleDownload = async (calendarDays) => {
  const formattedData = formatCalendarDataForExcel(calendarDays);

  try {
    const response = await axios.post("/user/downloadschedule", formattedData, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    console.error("Error downloading the Excel file", error);
  }
};

export const notifications = async () => {
  try {
    const response = await axios.get("/user/notifications");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to get notifications"
    );
  }
};

export const createNotification = async () => {
  try {
    const response = await axios.post("/user/createnotification");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to create notification"
    );
  }
};

export const pdfSummary = async ({ from, to }) => {
  try {
    const response = await axios.get(`/user/pdfsummary?from=${from}&to=${to}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to download pdf"
    );
  }
};
