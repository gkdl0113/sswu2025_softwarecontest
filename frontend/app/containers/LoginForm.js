// app/containers/LoginForm.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthForm from "../../components/auth/AuthForm";
import { changeField, login } from "../modules/auth";
import { ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { login, loading, error } = useSelector((state) => state.auth);

  const onSubmit = async () => {
    const resultAction = await dispatch(
      login({ id: login.id, password: login.password })
    );
    if (login.fulfilled.match(resultAction)) {
      router.push("/pages/MatchingPage");
    }
  };

  return (
    <>
      <AuthForm
        type="login"
        form={login}
        setForm={(form) => {
          Object.entries(form).forEach(([k, v]) =>
            dispatch(changeField({ form: "login", key: k, value: v }))
          );
        }}
        onSubmit={onSubmit}
      />
      {loading && <ActivityIndicator size="large" color="#fb923c" />}
      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
    </>
  );
}
