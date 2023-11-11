import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const getAllProducts = async (limit, skip) => {
    try {
        const response = await axios.get(`${API_URL}/products/getAllProducts`, {
            params: { 
                limit: limit, 
                skip: skip },
          });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getRecentProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products/getRecentProducts`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const scrapeAndStoreProduct = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/products/scrapeAndStoreProduct`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getProduct = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/products/getProduct`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addUserEmailToProduct = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/products/addUserEmailToProduct`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUserTrackedProducts = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/products/getUserTrackedProducts`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateProductDetails = async () => {
    try {
        const response = await axios.get(`${API_URL}/products/updateProductDetails`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// function register(data) {
//     return axios
//     .post(`${API_URL}/tenants/createTenant`, data)
//     .then((response) => {
//         return response;
//     });
// }
