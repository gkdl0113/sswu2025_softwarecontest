import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, StyleSheet } from "react-native";
import useCountdown from "../hooks/useCountdown";
import { API } from "../constants/api";

export default function SignupScreen() {
  // 입력
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // 상태
  const [loading, setLoading] = useState(false);
  const [idChecked, setIdChecked] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // 서버 식별자
  const [verificationId, setVerificationId] = useState("");
  const [verifiedToken, setVerifiedToken] = useState("");

  // 타이머
  const [ttl, setTtl] = useCountdown(0);
  const [resendWait, setResendWait] = useCountdown(0);

  // 유효성
  const validUsername = useMemo(() => /^[a-z0-9_]{3,16}$/i.test(username), [username]);
  const validEmail = useMemo(() => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email), [email]);
  const validPwd = useMemo(() => password.length >= 6, [password]);
  const pwdMatch = useMemo(() => password && password === password2, [password, password2]);

  const canSendCode = validEmail && !emailVerified && !loading;
  const canVerify = otp.length === 6 && verificationId && !emailVerified && !loading;
  const canSignup = idChecked && emailVerified && validPwd && pwdMatch && !loading;

  // 아이디 중복(지금은 형식 통과만, 추후 API 연결)
  const checkUsername = async () => {
    if (!validUsername) return Alert.alert("아이디 확인", "영문/숫자/밑줄 3~16자");
    setIdChecked(true);
    Alert.alert("아이디 확인", "사용 가능한 아이디입니다.");
  };

  const requestCode = async () => {
    if (!canSendCode) return;
    setLoading(true);
    try {
      const r = await fetch(API.requestCode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_email: email.trim() }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.detail || "코드 발송 실패");
      setVerificationId(data.verification_id);
      setEmailSent(true);
      setResendWait(30);
      setTtl(data.expires_in || 600);
      Alert.alert("인증메일 발송", "10분 내에 인증번호를 입력하세요.");
    } catch (e: any) {
      Alert.alert("에러", e.message || "코드 발송 실패");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!canVerify) return;
    setLoading(true);
    try {
      const r = await fetch(API.verifyCode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verification_id: verificationId, code: otp }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.detail || "인증 실패");
      setVerifiedToken(data.verified_token);
      setEmailVerified(true);
      Alert.alert("완료", "이메일 인증이 완료되었습니다.");
    } catch (e: any) {
      Alert.alert("에러", e.message || "인증 실패");
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!canSignup) return;
    setLoading(true);
    try {
      const r = await fetch(API.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified_token: verifiedToken, username: username.trim(), password }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.detail || data.message || "회원가입 실패");

      // 자동 로그인
      const r2 = await fetch(API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const t = await r2.json();
      if (!r2.ok) throw new Error(t.detail || "로그인 실패");

      Alert.alert("완료", "회원가입 및 로그인 완료!");
      // TODO: 토큰 보관/다음 화면 이동
    } catch (e: any) {
      Alert.alert("에러", e.message || "회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={S.wrap}>
      <View style={S.card}>
        <Text style={S.title}>회원가입</Text>

        {/* 아이디 */}
        <TextInput
          style={[S.input, !validUsername && username ? S.inputErr : null]}
          placeholder="아이디를 입력해주세요."
          value={username}
          onChangeText={(t) => { setUsername(t); setIdChecked(false); }}
          autoCapitalize="none"
        />
        <Pressable style={[S.btnOutline, !validUsername && S.btnDisabled]} onPress={checkUsername} disabled={!validUsername || loading}>
          <Text style={[S.btnOutlineText, !validUsername && S.btnOutlineTextDis]}>아이디 중복 검사하기</Text>
        </Pressable>

        {/* 이메일 */}
        <TextInput
          style={[S.input, !validEmail && email ? S.inputErr : null]}
          placeholder="이메일을 입력해주세요."
          value={email}
          onChangeText={(t) => { setEmail(t); setEmailVerified(false); setEmailSent(false); setOtp(""); setVerificationId(""); }}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!emailVerified}
        />
        <Pressable style={[S.btnGhost, (!canSendCode || emailVerified) && S.btnDisabled]} onPress={requestCode} disabled={!canSendCode}>
          <Text style={[S.btnGhostText, (!canSendCode || emailVerified) && S.btnGhostTextDis]}>
            인증번호를 메일로 발송합니다{resendWait > 0 ? ` (${resendWait}s)` : ""}
          </Text>
        </Pressable>

        {/* 인증번호 + 확인 */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TextInput
            style={[S.input, { flex: 1 }]}
            placeholder="인증번호"
            keyboardType="number-pad"
            value={otp}
            onChangeText={(t) => setOtp(t.replace(/[^0-9]/g, "").slice(0, 6))}
            editable={emailSent && !emailVerified}
          />
          <Pressable style={[S.smallBtn, (!canVerify || emailVerified) && S.btnDisabled]} onPress={verifyCode} disabled={!canVerify}>
            <Text style={S.smallBtnText}>인증번호 확인</Text>
          </Pressable>
        </View>
        {emailVerified ? (
          <Text style={S.okText}>이메일 인증 완료 ✅</Text>
        ) : emailSent ? (
          <Text style={S.helpText}>남은 시간 {fmt(ttl)} / 6자리 입력 후 확인</Text>
        ) : null}

        {/* 비밀번호 */}
        <TextInput
          style={[S.input, !validPwd && password ? S.inputErr : null]}
          placeholder="비밀번호를 입력해주세요."
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={[S.input, !pwdMatch && password2 ? S.inputErr : null]}
          placeholder="비밀번호를 한 번 더 입력해주세요."
          secureTextEntry
          value={password2}
          onChangeText={setPassword2}
        />

        {/* 회원가입 */}
        <Pressable style={[S.primaryBtn, !canSignup && S.btnDisabled]} onPress={submit} disabled={!canSignup}>
          <Text style={S.primaryBtnText}>회원가입</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const S = StyleSheet.create({
  wrap: { padding: 16, backgroundColor: "#f6f7fb", flexGrow: 1 },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, gap: 10, elevation: 2 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#d0d6e0", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, backgroundColor: "#fff" },
  inputErr: { borderColor: "#e11d48", backgroundColor: "#fff1f2" },
  okText: { color: "#15803d", marginTop: -6, marginBottom: 2 },
  helpText: { color: "#64748b", marginTop: -6, marginBottom: 2 },
  btnOutline: { borderWidth: 1, borderColor: "#6366f1", paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  btnOutlineText: { color: "#3730a3", fontWeight: "600" },
  btnOutlineTextDis: { color: "#a5b4fc" },
  btnGhost: { paddingVertical: 10, borderRadius: 10, alignItems: "center", backgroundColor: "#eef2ff" },
  btnGhostText: { color: "#3730a3", fontWeight: "600" },
  btnGhostTextDis: { color: "#a5b4fc" },
  smallBtn: { paddingHorizontal: 12, paddingVertical: 12, backgroundColor: "#e2e8f0", borderRadius: 10, alignItems: "center", justifyContent: "center" },
  smallBtnText: { color: "#0f172a", fontWeight: "600" },
  primaryBtn: { backgroundColor: "#4f46e5", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 6 },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  btnDisabled: { opacity: 0.5 },
});

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = ("0" + (sec % 60)).slice(-2);
  return `${m}:${s}`;
}
