import axios from 'axios';
import { API_URL, getAuthToken } from './authService';

export const getRapportInitData = async () => {
    try {
        const response = await axios.get(`${API_URL}rapport/ajout`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        throw error;
    }
};

export const addRapportAPI = async (rapportData) => {
    try {
        const response = await axios.post(`${API_URL}rapport/ajout`, rapportData, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du rapport:', error);
        throw error;
    }
};

export const listRapportAPI = async () => {
    try {
        const response = await axios.get(`${API_URL}rapport/liste`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors du chargement des rapports:', error);
        throw error;
    }
};
