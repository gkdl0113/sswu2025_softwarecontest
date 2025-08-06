import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Button from "../common/Button";

export default function AuthForm({ type, form, setForm, onSubmit }) {
  const textMap = {
    login: "로그인",
    register: "회원가입"
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{textMap[type]}</Text>

      {/* ID */}
      <View style={styles.field}>
        <Text style={styles.label}>ID</Text>
        <TextInput
          style={styles.input}
          placeholder="예: user1234"
          placeholderTextColor="#aaa"
          value={form.id}
          onChangeText={(text) => setForm("id", text)}
          autoCapitalize="none"
        />
      </View>
      

      {/* 이메일 */}
      {type === "register" && (
      <View style={styles.field}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.input}
          placeholder="202XXXXX@sungshin.ac.kr"
          placeholderTextColor="#aaa"
          value={form.email}
          onChangeText={(text) => setForm("id", text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      )}

      {/* 비밀번호 */}
      <View style={styles.field}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => setForm("id", text)}
        />
      </View>

      {/* 비밀번호 확인 (회원가입 전용) */}
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
    alignItems: "center"
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});
