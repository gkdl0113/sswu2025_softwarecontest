import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import styled from "styled-components/native";

const AuthTemplateBlock = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding: 24px;
  border-top-left-radius: 60px;
  border-top-right-radius: 60px;
  margin-top: 24px;
  elevation: 12;
`;

export default function AuthTemplate({ children }) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} 
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled" 
      >
        <AuthTemplateBlock>{children}</AuthTemplateBlock>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
