import axios from 'axios';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (login: string, password: string) => {
    const response = await api.post('/auth/login', { login, password });
    return response.data;
  },
  register: async (data: {
    login: string;
    password: string;
    name: string;
    description?: string;
    cnpj: string;
    address?: string;
    logo_path?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export const formsService = {
  create: async (form: {
    question: string;
    question_type: 'scale_0_5' | 'scale_0_10' | 'text_opinion';
    order?: number;
    is_optional?: boolean;
  }) => {
    const response = await api.post('/forms', form);
    return response.data;
  },
  createMultiple: async (forms: Array<{
    question: string;
    question_type: 'scale_0_5' | 'scale_0_10' | 'text_opinion';
    order?: number;
    is_optional?: boolean;
  }>) => {
    const response = await api.post('/forms/multiple', { forms });
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/forms');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/forms/${id}`);
    return response.data;
  },
  update: async (id: string, form: Partial<{
    question: string;
    question_type: 'scale_0_5' | 'scale_0_10' | 'text_opinion';
    order?: number;
    is_optional?: boolean;
  }>) => {
    const response = await api.patch(`/forms/${id}`, form);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/forms/${id}`);
    return response.data;
  },
  checkFormExists: async () => {
    const response = await api.get('/forms/check/exists');
    return response.data.exists;
  },
  getPublicByCompanyId: async (companyId: string) => {
    const response = await api.get(`/forms/public/company/${companyId}`);
    return response.data;
  },
};

export const companiesService = {
  getMe: async () => {
    const response = await api.get('/companies/me');
    return response.data;
  },
  update: async (data: {
    name?: string;
    description?: string;
    cnpj?: string;
    address?: string;
  }) => {
    const response = await api.put('/companies/me', data);
    return response.data;
  },
  uploadLogo: async (formData: FormData) => {
    const response = await api.post('/companies/me/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const surveysService = {
  getStatistics: async () => {
    const response = await api.get('/satisfaction-surveys/company/statistics');
    return response.data;
  },
  getResponsesBySession: async (surveyId: string) => {
    const response = await api.get(`/satisfaction-surveys/session/${surveyId}`);
    return response.data;
  },
};

export const suggestionsService = {
  getSuggestions: async () => {
    // Esta é uma API pública, não precisa de autenticação
    const response = await axios.get('https://api.waleskacaetano.com.br/suggestions-questions');
    return response.data;
  },
};

export default api;

