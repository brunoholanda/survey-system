import axios from 'axios';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

// API pública sem autenticação
const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicFormsService = {
  getByCompanyId: async (companyId: string) => {
    const response = await publicApi.get(`/forms/public/company/${companyId}`);
    return response.data;
  },
};

export const publicSurveysService = {
  createMultiple: async (surveys: Array<{
    form_id: string;
    scale_value?: number;
    text_response?: string;
  }>) => {
    const response = await publicApi.post('/satisfaction-surveys/multiple', { surveys });
    return response.data;
  },
};

export const publicCompaniesService = {
  getById: async (id: string) => {
    const response = await publicApi.get(`/companies/public/${id}`);
    return response.data;
  },
};

export default publicApi;

