// src/api/client.js
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const sendCode = (email) =>
  axios.post(`${API_BASE}/send-code/`, { email }).then(res => res.data);

export const verifyCode = (email, code) =>
  axios.post(`${API_BASE}/verify-code/`, { email, code }).then(res => res.data);
