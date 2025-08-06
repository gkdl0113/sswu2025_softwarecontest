import React from "react";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";

// Gradient 스타일 정의
const GradientButton = styled(LinearGradient).attrs({
  colors: ["#d1d5db", "#fb923c"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 }
})`
  border-radius: 24px;
  padding-vertical: 14px;
  align-items: center;
  justify-content: center;
  marginTop: 20px;
`;

// 버튼 텍스트 스타일
const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: white;
`;

// 버튼 컴포넌트
export default function Button({ children, onPress, ...props }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <GradientButton {...props}>
        <ButtonText>{children}</ButtonText>
      </GradientButton>
    </TouchableOpacity>
  );
}
