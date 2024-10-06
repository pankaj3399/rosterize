import axios from "../utils/axiosConfig";

export const getLeaves = async (status) => {
  try {
    const response = await axios.get(`/departmenthead/leaves?status=${status}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const changeLeaveStatus = async ({ id, status }) => {
  try {
    const response = await axios.post(`/departmenthead/leave/status/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getSchedule = async ({ from, to }) => {
  try {
    const response = await axios.get(
      `/departmenthead/schedule?from=${from}&to=${to}`
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const addSchedule = async ({
  user,
  company,
  clockIn,
  clockOut,
  date,
  project_id,
}) => {
  console.log(user, company, clockIn, clockOut, date, project_id);
  try {
    const response = await axios.post(`/departmenthead/schedule`, {
      user,
      company,
      clockIn,
      clockOut,
      date,
      project_id,
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const downloadSchedule = async ({ from, to }) => {
  try {
    if (!from || !to) return "Please provide from and to date.";
    const response = await axios.get(
      `/departmenthead/downloadschedule?from=${from}&to=${to}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to download schedule"
    );
  }
};

export const listDepartmentHeadProjects = async (departmentHead_id) => {
  try {
    const response = await axios.get(
      `/departmenthead/listDepartmentHeadProjects`,
      {
        params: { departmentHead_id },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to list projects"
    );
  }
};

export const listCompanyHeadProjects = async (company_id) => {
  try {
    const response = await axios.get(`/departmenthead/listComapanyProjects`, {
      params: { company_id },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to list projects"
    );
  }
};

export const getAllUserLeaves = async ({
  departmentHeadId,
  from,
  to,
  status,
}) => {
  try {
    const response = await axios.get(`/departmenthead/getleaves`, {
      params: {
        departmentHeadId,
        from,
        to,
        status,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to get leaves"
    );
  }
};

export const getAllUserInCompanyLeaves = async ({
  companyId,
  from,
  to,
  status,
}) => {
  try {
    const response = await axios.get(`/departmenthead/getusersleaves`, {
      params: {
        companyId,
        from,
        to,
        status,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to get leaves"
    );
  }
};
