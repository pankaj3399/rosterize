import axios from "../utils/axiosConfig";

export const listSkills = async (company) => {
  try {
    const response = await axios.get(`/skill/list`, {
      params: { company: company },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch roles");
  }
};

export const createSkill = async ({ name, company }) => {
  try {
    const response = await axios.post("/skill/create", {
      name,
      company,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to create role"
    );
  }
};

export const removeSkill = async (skillId) => {
  try {
    const response = await axios.delete(`/skill/remove/${skillId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to remove role"
    );
  }
};
