import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard-stats');
  return response.data;
};

export const getProjects = async (filters?: { status?: string; type?: string }) => {
  const params = new URLSearchParams();
  if (filters?.status && filters.status !== 'all') {
    params.append('status', filters.status);
  }
  if (filters?.type && filters.type !== 'all') {
    params.append('type', filters.type);
  }
  const response = await api.get(`/projects?${params.toString()}`);
  return response.data;
};

export const addProject = async (projectData: any) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

export const updateProject = async (id: number, projectData: any) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id: number) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

export const getActivities = async (category?: string) => {
  const params = new URLSearchParams();
  if (category && category !== 'all') {
    params.append('category', category);
  }
  const response = await api.get(`/activities?${params.toString()}`);
  return response.data;
};
export const getRatings = async () => {
  const response = await api.get('/ratings');
  return response.data;
};
