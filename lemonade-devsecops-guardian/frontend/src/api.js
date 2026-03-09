import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
});

export async function scanCode(code) {
  const { data } = await api.post('/scan/code', { code });
  return data;
}

export async function scanFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post('/scan/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

export async function scanRepo(repoUrl) {
  const { data } = await api.post('/scan/repo', { repoUrl });
  return data;
}
