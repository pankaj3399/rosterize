import axios from "../utils/axiosConfig";

export const createProject = async (project) => {
  try {
    const response = await axios.post("/project/create", project);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error ||
        error.message ||
        "Failed to create project"
    );
  }
};

export const listProjects = async () => {
  try {
    const response = await axios.get("/project/list");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to list users"
    );
  }
};

export const searchProject = async ({ projectName }) => {
  try {
    const response = await axios.get(`/project/list`, {
      params: {
        projectName,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to search user"
    );
  }
};

export const deleteProject = async (project_id) => {
  try {
    const response = await axios.delete(`/project/remove/${project_id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error ||
        error.message ||
        "Failed to delete project"
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

export const deleteDepartmentHeadProject = async (project_id) => {
  try {
    const response = await axios.delete(
      `/departmenthead/removeDepartmentHeadProjects/${project_id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error ||
        error.message ||
        "Failed to delete project"
    );
  }
};

export const searchDepartmentHeadProject = async ({
  departmentHead_id,
  projectName,
}) => {
  try {
    const response = await axios.get(
      `/departmenthead/listDepartmentHeadProjects`,
      {
        params: { departmentHead_id, projectName },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Failed to search project"
    );
  }
};
