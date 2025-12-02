import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get token from localStorage
const getToken = () => {
  const userInfo = localStorage.getItem('user'); // Changed from 'userInfo' to 'user'
  if (userInfo) {
    const parsed = JSON.parse(userInfo);
    return parsed.token;
  }
  return null;
};

// Upload single file
export const uploadSingleFile = async (file) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/api/upload/single`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

// Upload multiple files
export const uploadMultipleFiles = async (files) => {
  const token = getToken();
  const formData = new FormData();

  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await axios.post(`${API_URL}/api/upload/multiple`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

// Delete file
export const deleteFile = async (filename) => {
  const token = getToken();

  const response = await axios.delete(`${API_URL}/api/upload/${filename}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export default {
  uploadSingleFile,
  uploadMultipleFiles,
  deleteFile
};
