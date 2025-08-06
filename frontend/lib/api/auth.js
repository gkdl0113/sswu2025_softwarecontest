import client from "./client";
import { Alert } from "react-native";

// 회원가입
export const signup = async (username, email, password, confirmPassword) => {
  try {
    const res = await client.post("/signup/", {
      username,
      email,
      password,
      confirm_password: confirmPassword
    });

    if (res.data.message) {
      Alert.alert("성공", "회원가입 완료!");
    } else {
      Alert.alert("오류", JSON.stringify(res.data));
    }
  } catch (error) {
    if (error.response) {
      Alert.alert("오류", JSON.stringify(error.response.data));
    } else {
      Alert.alert("네트워크 오류 발생");
    }
  }
};

// 로그인, ID찾기, 비번찾기도 여기에 추가
