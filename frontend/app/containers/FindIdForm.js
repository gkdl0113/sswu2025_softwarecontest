import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthForm from "../../components/auth/AuthForm";
import { changeField, findid } from "../modules/auth";
import { ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";

export default function FindIdForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { findid: findidForm, loading, error } = useSelector((state) => state.auth);
  const [foundId, setFoundId] = useState(null);

  const onSubmit = async () => {
    try {
      const resultAction = await dispatch(
        findid({ email: findidForm.email })
      );

      if (findid.fulfilled.match(resultAction)) {
        const id = resultAction.payload.id; // 서버에서 { id: "user123" } 반환 가정
        setFoundId(id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <AuthForm
        type="findid"
        form={findidForm}
        setForm={(key, value) =>
          dispatch(changeField({ form: "findid", key, value }))
        }
        onSubmit={onSubmit}
      />

      {loading && <ActivityIndicator size="large" color="#fb923c" />}

      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}

      {foundId && (
        <Text style={{ marginTop: 20, fontWeight: "bold", fontSize: 16 }}>
          당신의 아이디는: {foundId}
        </Text>
      )}
    </>
  );
}
