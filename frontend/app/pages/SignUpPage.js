import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AuthTemplate from "../../components/auth/AuthTemplate";
import SignUpForm from "../containers/SignUpForm";
import DotsOverlay from "../../components/common/DotsOverlay";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { signup } from "../../lib/api/auth";

const { height } = Dimensions.get("window");

export default function SignUpPage() {
  const slideAnim = useRef(new Animated.Value(height * 0.15)).current;
  const [form, setForm] = useState({ id: "", email: "", password: "", confirmPassword: "" });
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      slideAnim.setValue(height * 0.15);
    }, [slideAnim])
  );

  const hideSignUp = () => {
    Animated.spring(slideAnim, {
      toValue: height * 0.35,
      friction: 7,
      tension: 60,
      useNativeDriver: true
    }).start(() => {
      router.push({
      pathname: "/pages/LoginPage",
      params: { fade: true }
    });
    });
  };

  const onSubmit = async () => {
    console.log("회원가입 데이터:", form);

    try {
      await signup(
        form.id,
        form.email,
        form.password,
        form.confirmPassword
      );

    router.push("/pages/LoginPage");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const hideSignUp = () => {
      Animated.spring(slideAnim, {
        toValue: height * 0.4, // 아래로 내림
        useNativeDriver: true
      }).start(() => {
        router.back();
      });
    };

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
    <LinearGradient 
    colors={["#d1d5db", "#fb923c"]} 
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{ flex: 1 }}
    >
      <DotsOverlay />
      <View style={styles.header}>
        <TouchableOpacity onPress={hideSignUp} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={{ marginLeft: 6 }}>Back</Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={{ transform: [{ translateY: slideAnim }], flex: 1}}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <AuthTemplate>
            <SignUpForm
              type="register"
              form={form}
              setForm={setForm}
              onSubmit={onSubmit}
            />
          </AuthTemplate>
        </KeyboardAvoidingView>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center"
  }
}); 