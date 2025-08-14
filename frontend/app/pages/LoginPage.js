import React, { useRef, useState, useEffect, useCallback } from "react";
import styled from "styled-components/native";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useDispatch } from "react-redux";
import { login } from "../modules/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LoginForm from "../containers/LoginForm";
import AuthTemplate from "../../components/auth/AuthTemplate";
import DotsOverlay from "../../components/common/DotsOverlay";
import { useFocusEffect } from "@react-navigation/native";

const { height } = Dimensions.get("window");

export default function LoginPage() {
  const slideAnim = useRef(new Animated.Value(height * 0.35)).current;
  const [form, setForm] = useState({ id: "", password: "" });
  const dispatch = useDispatch();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      slideAnim.setValue(height * 0.35); 
    }, [slideAnim])
  );

  const onSubmit = () => {
    const user = { id: form.id };
    const token = "abc123";
    dispatch(login(user, token));
    router.push("/MatchingPage");
  };

  const goToSignUp = () => {
    Animated.spring(slideAnim, {
      toValue: height * 0.15,
      friction: 7,
      tension: 60,
      useNativeDriver: true
    }).start(() => {
      router.push("/pages/SignUpPage");
    });
  };

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      Animated.timing(slideAnim, {
        toValue: height * 0.05,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(slideAnim, {
        toValue: height * 0.3,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [slideAnim]);

  return (
    <Container>
      <LinearGradient 
      colors={["#d1d5db", "#fb923c"]} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
      >
        <DotsOverlay />
        <Animated.View style={{ transform: [{ translateY: slideAnim }], flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
          >
            <AuthTemplate>
              <LoginForm type="login" form={form} setForm={setForm} onSubmit={onSubmit} />
              <View style={styles.findRow}>
                <TouchableOpacity onPress={() => router.push("/pages/FindIdPage")}>
                    <Text style={styles.findLink}>아이디 찾기</Text>
                </TouchableOpacity>
                <Text style={{marginHorizontal: 5}}>|</Text>
                <TouchableOpacity onPress={() => router.push("/pages/FindPasswordPage")}>
                    <Text style={styles.findLink}>비밀번호 찾기</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.signupRow}>
                <Text>아직 계정이 없으신가요? </Text>
                <TouchableOpacity onPress={goToSignUp}>
                  <Text style={styles.signupLink}>회원가입</Text>
                </TouchableOpacity>
              </View>
            </AuthTemplate>
          </KeyboardAvoidingView>
        </Animated.View>
      </LinearGradient>
    </Container>
  );
}

const styles = StyleSheet.create({
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10
  },
  signupLink: {
    fontWeight: "bold",
    color: "#fb923c"
  },
  findRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20
  },
  findLink: {
    color: "#fb923c"
  }
});

const Container = styled.View`
  flex: 1;
`;
