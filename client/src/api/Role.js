import axios from '../utils/axiosConfig';

export const listRoles = async (companyId) => {
    try {
        const response = await axios.get(`/role/list/${companyId}`);
        return response.data;
    }
    catch (error) {
        throw new Error(error.message || 'Failed to fetch roles');
    }
}

export const createRole = async ({ name, companyId }) => {
    try {
        const response = await axios.post('/role/create', { name, company: companyId });
        return response.data;
    }
    catch (error) {
        throw new Error(error?.response?.data?.message || error.message || 'Failed to create role');
    }
}

export const removeRole = async (roleId) => {
    try {
        const response = await axios.delete(`/role/remove/${roleId}`);
        return response.data;
    }
    catch (error) {
        throw new Error(error?.response?.data?.message || error.message || 'Failed to remove role');
    }
}
