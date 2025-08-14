import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthForm from "../../components/auth/AuthForm";
import { changeField, findpw } from "../modules/auth";
import { ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";

export default function FindPasswordForm() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { findpw, loading, error} = useSelector((state) => state.auth);

    const onSubmit = async () => {
        const resultAction = await dispatch(
            findpw({
                id: findpw.id,
                email: findpw.email,
            })
        );
        if (findpw.fulfilled.match(resultAction)) {
          router.push("/pages/LoginPage")
        }
    };

    return (
        <>
          <AuthForm
            type="findpw"
            form={findpw}
            setForm={(form) => {
              Object.entries(form).forEach(([k, v]) =>
                dispatch(changeField({ form: "findpw", key: k, value: v }))
              );
            }}
            onSubmit={onSubmit}
          />
          {loading && <ActivityIndicator size="large" color="#fb923c" />}
          {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
        </>
    );
}