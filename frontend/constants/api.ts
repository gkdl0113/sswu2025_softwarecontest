// frontend/constants/api.ts
export const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export const API = {
  requestCode: `${API_BASE}/auth/request-code/`,
  verifyCode: `${API_BASE}/auth/verify-code/`,
  signup: `${API_BASE}/auth/signup/`,
  login: `${API_BASE}/auth/login/`,
};

// ⚠️ 실제 기기/에뮬레이터에서 테스트할 때
// - iOS 시뮬레이터: http://127.0.0.1:8000 OK
// - Android 에뮬레이터: http://10.0.2.2:8000 사용
// - 실제 폰: http://<컴퓨터IP>:8000 (같은 Wi-Fi)
// 필요하면 .env에 EXPO_PUBLIC_API_BASE 달아서 바꿔줘.
