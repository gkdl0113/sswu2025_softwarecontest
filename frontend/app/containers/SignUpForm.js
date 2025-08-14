import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthForm from "../../components/auth/AuthForm";
import { changeField, register } from "../modules/auth";
import { ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";
import Button from "../../components/common/Button";

export default function SignUpForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const registerForm = useSelector((state) => state.auth.register);
  const {loading, error } = useSelector((state) => state.auth);

  const [idAvailable, setIdAvailable] = useState(null); 
  const [checkingId, setCheckingId] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [authCode, setAuthCode] = useState("");

  const handleCheckId = async () => {
    setCheckingId(true);
    try {
      const res = await checkIdAPI(registerForm.id); // 예: /api/check-id?id=xxx
      setIdAvailable(res.available);
    } catch (e) {
      setIdAvailable(false);
    } finally {
      setCheckingId(false);
    }
  };

  const handleSendCode = async () => {
    try {
      await sendVerificationCodeAPI(registerForm.email);
      setEmailSent(true);
      alert("인증번호가 이메일로 전송되었습니다.");
    } catch (e) {
      alert("인증번호 전송 실패");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await verifyCodeAPI(registerForm.email, authCode);
      if (res.verified) {
        setEmailVerified(true);
        alert("이메일 인증 성공!");
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
    } catch (e) {
      alert("인증 확인 실패");
    }
  };

  const onSubmit = async () => {
    if (!idAvailable) return alert("아이디 중복 확인이 필요합니다.");
    if (!emailVerified) return alert("이메일 인증을 완료해주세요.");
    if (registerForm.password !== registerForm.confirmPassword) {
      return alert("비밀번호가 일치하지 않습니다.");
    }

    const resultAction = await dispatch(
      register({
        id: register.id,
        email: register.email,
        password: register.password,
      })
    );
    if (register.fulfilled.match(resultAction)) {
      router.push("/LoginPage");
    }
  };

  return (
    <>
      <AuthForm
        type="register"
        form={registerForm}
        setForm={(key, value) => dispatch(changeField({ form: "register", key, value }))}
        onSubmit={onSubmit}
        authCode={authCode}
        setAuthCode={setAuthCode}
        emailSent={emailSent}
        emailVerified={emailVerified}
        handleSendCode={handleSendCode}
        handleVerifyCode={handleVerifyCode}
      />
      {checkingId && <ActivityIndicator size="small" color="#fb923c" />}
      {loading && <ActivityIndicator size="large" color="#fb923c" />}
      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
    </>
  );
}
