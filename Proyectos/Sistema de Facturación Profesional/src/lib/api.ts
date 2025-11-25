// ============================================================================
// API SERVICE - HTTP client for backend communication
// ============================================================================

import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api';

// Export API_BASE_URL for direct URL construction
export const getApiBaseUrl = () => API_BASE_URL;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// AUTH API
// ============================================================================

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string, name: string, businessName?: string) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      name,
      businessName,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateCurrentUser: async (data: any) => {
    const response = await apiClient.put('/auth/me', data);
    return response.data;
  },
};

// ============================================================================
// CLIENTS API
// ============================================================================

export const clientsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/clients');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/clients', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/clients/${id}`);
    return response.data;
  },
};

// ============================================================================
// INVOICES API
// ============================================================================

export const invoicesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/invoices');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/invoices', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/invoices/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/invoices/${id}`);
    return response.data;
  },

  send: async (id: string) => {
    const response = await apiClient.put(`/invoices/${id}`, {
      status: 'SENT',
      sentDate: new Date().toISOString(),
    });
    return response.data;
  },

  markAsPaid: async (id: string) => {
    const response = await apiClient.put(`/invoices/${id}`, {
      status: 'PAID',
      paidDate: new Date().toISOString(),
    });
    return response.data;
  },

  downloadPDF: async (id: string) => {
    const response = await apiClient.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    });

    // Create a blob URL and trigger download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

// ============================================================================
// PROJECTS API
// ============================================================================

export const projectsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  getByClient: async (clientId: string) => {
    const response = await apiClient.get(`/projects/client/${clientId}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },
};

// ============================================================================
// TIMESHEET API
// ============================================================================

export const timesheetAPI = {
  getAll: async (params?: { projectId?: string; status?: string; startDate?: string; endDate?: string; isBillable?: boolean }) => {
    const response = await apiClient.get('/timesheet', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/timesheet/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/timesheet', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/timesheet/${id}`, data);
    return response.data;
  },

  approve: async (id: string) => {
    const response = await apiClient.put(`/timesheet/${id}/approve`);
    return response.data;
  },

  reject: async (id: string, reason?: string) => {
    const response = await apiClient.put(`/timesheet/${id}/reject`, { reason });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/timesheet/${id}`);
    return response.data;
  },
};

// ============================================================================
// SETTINGS API
// ============================================================================

export const settingsAPI = {
  getSettings: async () => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  updateSettings: async (data: any) => {
    const response = await apiClient.put('/settings', data);
    return response.data;
  },
};

export default apiClient;
