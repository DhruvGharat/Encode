import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authService = {
    login: async (credentials) => {
        // Mocking API call
        console.log('Logging in with:', credentials);
        return { data: { token: 'mock-jwt-token', user: { name: 'Dhruv Gharat', id: '123' } } };
    },
    signup: async (userData) => {
        console.log('Signing up with:', userData);
        return { data: { success: true } };
    },
};

export const testService = {
    submitMMSE: async (scoreData) => {
        console.log('Submitting MMSE:', scoreData);
        return { data: { success: true, riskLevel: 'Low' } };
    },
    submitMoCA: async (scoreData) => {
        console.log('Submitting MoCA:', scoreData);
        return { data: { success: true, riskLevel: 'Low' } };
    },
    submitSpeech: async (formData) => {
        console.log('Submitting Speech Data');
        return { data: { success: true, analysis: 'Normal' } };
    },
    uploadMRI: async (formData) => {
        console.log('Uploading MRI Scans');
        return { data: { success: true, reportId: 'REP-789' } };
    }
};

export const doctorService = {
    sendReport: async (reportData) => {
        console.log('Sending report to doctor:', reportData);
        return { data: { success: true } };
    }
};

export default api;
