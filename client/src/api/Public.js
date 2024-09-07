import axios from '../utils/axiosConfig';

export const listPlansAndReviews = async () => {
    try {
        const response = await axios.get('/public/list');
        return response.data;
    } catch (error) {
        return error.message;
    }
}

export const createCompany = async ({ name, address, email, phone, password, UEN, subscriptionPlan, industry, website, message }) => {
    try {
        const response = await axios.post('/public/company', {
            name,
            address,
            email,
            phone,
            password,
            UEN,
            subscriptionPlan,
            industry,
            website,
            message
        });
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error?.message || 'Error creating company');
    }
}

export const enquire = async ({ name, email, company, subject, message }) => {
    try {
        const response = await axios.post('/public/enquire', {
            name,
            email,
            company,
            subject,
            message
        });
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.error || error?.message || 'Error sending enquiry');
    }
}
