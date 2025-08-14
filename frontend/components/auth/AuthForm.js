import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Button from "../common/Button";

export default function AuthForm({  
  type, form, setForm, onSubmit, 
  authCode, setAuthCode, emailSent, emailVerified, 
  handleSendCode, handleVerifyCode, handleCheckId }) {
  const textMap = {
    login: "로그인",
    register: "회원가입",
    findpw: "메일 보내기",
    findid: "아이디 찾기"
  };
  const textTitle = {
    login: "다시 오신 걸 환영합니다",
    register: "계정 만들기",
    findpw: "비밀번호 찾기",
    findid: "이메일을 인증해 주세요",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{textTitle[type]}</Text>

      {/* ID */}
      {(type === "login" || type === "findpw") && (
      <View style={styles.field}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          style={styles.input}
          placeholder="예: user1234"
          placeholderTextColor="#aaa"
          value={form.id}
          onChangeText={(text) => setForm("id", text)}
          autoCapitalize="none"
        />
      </View>
      )}

      {(type === "register") && (
      <View style={styles.fieldRow}>
        <Text style={styles.label}>아이디</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="예: user1234"
            placeholderTextColor="#aaa"
            value={form.id}
            onChangeText={(text) => setForm("id", text)}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.smallButton} onPress={handleCheckId}>
            <Text style={styles.smallButtonText}>중복확인</Text>
          </TouchableOpacity>
        </View>
      </View>
      )}
      

      {/* 이메일 */}
      {(type === "findpw") && (
      <View style={styles.field}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.input}
          placeholder="202XXXXX@sungshin.ac.kr"
          placeholderTextColor="#aaa"
          value={form.email}
          onChangeText={(text) => setForm("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      )}

      {(type === "register" || type === "findid") && (
      <View style={styles.fieldRow}>
        <Text style={styles.label}>이메일</Text>
        <View style={styles.inputWithButton}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="202XXXXX@sungshin.ac.kr"
            placeholderTextColor="#aaa"
            value={form.email}
            onChangeText={(text) => setForm("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.smallButton} onPress={handleSendCode}>
            <Text style={styles.smallButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </View>
      )}

      {(type === "register" || type === "findid") && (
        <View style={styles.fieldRow}>
          <Text style={styles.label}>인증번호</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="인증번호를 입력하세요"
              placeholderTextColor="#aaa"
              value={authCode}
              onChangeText={setAuthCode}
            />
            <TouchableOpacity style={styles.smallButton} onPress={handleVerifyCode}>
              <Text style={styles.smallButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {emailVerified && <Text style={{ color: "green", marginTop: 6 }}>인증 완료!</Text>}

      {/* 비밀번호 */}
      {(type === "login" || type === "register") && (
        <View style={styles.field}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={form.password}
            onChangeText={(text) => setForm("password", text)}
          />
        </View>
      )}

      {/* 비밀번호 확인*/}
      {type === "register" && (
        <View style={styles.field}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(text) => setForm("id", text)}
          />
        </View>
      )}

      <Button style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>{textMap[type]}</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", padding: 10 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 6, color: "#333" },
  input: {
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12
  },
  button: {
    backgroundColor: "#fb923c",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",

    // 그림자 (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // 그림자 (Android)
    elevation: 3,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  fieldRow: {
    marginBottom: 16,
  },
  inputWithButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallButton: {
    backgroundColor: "#fb923c",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 8,
    borderRadius: 6,
  },
  smallButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
