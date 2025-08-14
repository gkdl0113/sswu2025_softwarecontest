import React, {useState, useEffect} from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
  StyleSheet,
  Platform,
  Image
 } from "react-native";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native"
import { useRouter } from "expo-router";
import FindPasswordForm from "../containers/FindPasswordForm"
import { findpw } from "../modules/auth";


const {height} = Dimensions.get("window");

export default function FindPasswordPage() {
  const [form, setForm] = useState({id: "", email: ""});
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async () => {
    console.log("비밀번호 찾기 데이터:", form);

    try {
      console.log("비밀번호 찾기 데이터:", form);

      await findpw(
        form.id,
        form.email,
      )
      Alert.alert("이메일 전송됨")
      router.push("/pages/LoginPage");
    } catch (error) {
      console.error(error);
    }
  }


  const handleSend = () => {
    Alert.alert("Verification sent", `Email sent to ${email}`)
  };
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={{ marginLeft: 6 }}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Image
          source={require("../../assets/images/Ellipse 1.png")}
          style={styles.ellipse}
        />
        <Image
          source={require("../../assets/images/password.png")}
          style={styles.icon}
        />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: 40 }}>
          <FindPasswordForm />
        </View>
      </KeyboardAvoidingView>
    </>
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
  },
  container: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: 120,
  },
  ellipse: {
    width: 220,
    height: 220,
    resizeMode: "contain",
  },
  icon: {
    width: 80,
    height: 80,
    position: "absolute", 
    top: "50%",  
    left: "50%", 
    marginLeft: -40,
    marginTop: -40,
  },
});


const  Ellipse1 = styled.View`
  height: 286px;
  width: 286px;
`