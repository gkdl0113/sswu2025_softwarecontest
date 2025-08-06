import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthForm from "../../components/auth/AuthForm";
import { changeField, register } from "../modules/auth";
import { ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";

export default function SignUpForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { register, loading, error } = useSelector((state) => state.auth);

  const onSubmit = async () => {
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
        form={register}
        setForm={(key, value) => 
          dispatch(changeField({ form: "register", key, value }))
          }

        onSubmit={onSubmit}
      />
      {loading && <ActivityIndicator size="large" color="#fb923c" />}
      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
    </>
  );
}
