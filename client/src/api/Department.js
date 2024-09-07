import axios from '../utils/axiosConfig';

export const listDepartments = async (companyId) => {
  try {
    const response = await axios.get(`/department/${companyId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch departments');
  }
};

export const createDepartment = async ({ name, companyId }) => {
    try {
        const response = await axios.post('/department', { name, company: companyId });
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error.message || 'Failed to create department');
    }
}

export const removeDepartment = async (departmentId) => {
    try {
        const response = await axios.delete(`/department/${departmentId}`);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error.message || 'Failed to remove department');
    }
}
