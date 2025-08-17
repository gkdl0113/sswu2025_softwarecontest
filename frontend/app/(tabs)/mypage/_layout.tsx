// app/(tabs)/mypage/_layout.tsx
import { Stack } from 'expo-router';

export default function MyPageLayout() {
  return (
    <Stack
      initialRouteName="index"   // ✅ 마이페이지 스택 루트 고정
      screenOptions={{
        headerShown: false,      // 커스텀 헤더 사용
        animation: 'slide_from_right',
      }}
    />
  );
}
