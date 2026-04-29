const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

// ===== Auth =====
export const authAPI = {
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  register: (name, email, password, role) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  }),
  me: () => request('/auth/me'),
  googleLogin: (data) => request('/auth/google', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// ===== Jobs =====
export const jobsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/jobs${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/jobs/${id}`),
  create: (data) => request('/jobs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  apply: (id) => request(`/jobs/${id}/apply`, { method: 'POST' }),
  bookmark: (id) => request(`/jobs/${id}/bookmark`, { method: 'POST' }),
  update: (id, data) => request(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => request(`/jobs/${id}`, { method: 'DELETE' }),
};

// ===== Users =====
export const usersAPI = {
  getProfile: () => request('/users/profile'),
  updateProfile: (data) => request('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getBookmarks: () => request('/users/bookmarks'),
  getNotifications: () => request('/users/notifications'),
  markNotificationRead: (id) => request(`/users/notifications/${id}/read`, { method: 'PUT' }),
};

// ===== Resume =====
export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return request('/resume/upload', {
      method: 'POST',
      body: formData,
    });
  },
  analyze: (resumeId) => request('/resume/analyze', {
    method: 'POST',
    body: JSON.stringify({ resumeId }),
  }),
  getResults: () => request('/resume/results'),
};

// ===== Chat =====
export const chatAPI = {
  sendMessage: (message, mode) => request('/chat/message', {
    method: 'POST',
    body: JSON.stringify({ message, mode }),
  }),
  getHistory: () => request('/chat/history'),
};
