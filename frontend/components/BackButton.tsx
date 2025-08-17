// components/BackButton.tsx
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

type Props = {
  color?: string;
  size?: number;
  /** 히스토리가 없을 때 이동할 경로 (예: "/(tabs)/mypage") */
  fallbackHref?: Href;
};

const BackButton = ({ color = '#29323A', size = 22, fallbackHref }: Props) => {
  const navigation = useNavigation<any>();
  const router = useRouter();

  const onPress = () => {
    // 1) 스택 히스토리가 있으면 pop
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    // 2) 히스토리 없으면 폴백 경로로 대체 이동
    if (fallbackHref) {
      router.replace(fallbackHref);
      return;
    }
    // 3) 폴백 미지정 시 루트로
    router.replace('/'); // '/'도 Href에 포함됩니다.
  };

  return (
    <Pressable style={s.wrap} onPress={onPress} hitSlop={10}>
      <Ionicons name="chevron-back" size={size} color={color} />
    </Pressable>
  );
};

const s = StyleSheet.create({
  wrap: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default BackButton;
