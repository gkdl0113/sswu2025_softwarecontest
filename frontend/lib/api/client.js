import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "../../app/modules/store";
import { logout } from "../../app/modules/auth";

const BASE_URL = "http://192.168.219.106:8000/api";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ [1] 토큰 필요 없는 URL 예외 처리
const PUBLIC_URLS = [
  "/signup/", 
  "/token/", 
  "/password-reset/",
  "/password-reset/confirm/",
  "/find-id/",
];

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  const isPublic = PUBLIC_URLS.some((url) => config.url.includes(url));

  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ [2] 401 에러 응답 시 예외 처리
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const isPublic = PUBLIC_URLS.some((url) =>
      error.config?.url?.includes(url)
    );

    if (error.response?.status === 401 && !isPublic) {
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

export default client;
