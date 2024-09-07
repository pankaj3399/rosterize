import axios from '../utils/axiosConfig';

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post('/auth/login', {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error?.message || 'Login failed');
    
  }
};

export const me = async () => {
  try {
    const response = await axios.get('/user/me');
    return response.data; 
  } catch (error) {
    throw new Error(error.message || 'User not found');
  }
}

export const sendResetCode = async ({email}) => {
  try {
    const response = await axios.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error?.message || 'Failed to send reset code');
  }
}

export const resetPassword = async ({email, password, code}) => {
  try {
    const response = await axios.post('/auth/reset-password', { email, password, code });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error || error?.message || 'Failed to reset password');
  }
}

