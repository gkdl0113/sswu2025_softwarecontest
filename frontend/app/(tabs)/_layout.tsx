// app/(tabs)/_layout.tsx
import 'react-native-gesture-handler';
import { Tabs, router } from 'expo-router';
import { Platform, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeIcon from '../../assets/images/home.svg';
import StoreIcon from '../../assets/images/store.svg';
import MatchIcon from '../../assets/images/matching.svg';
import MyPageIcon from '../../assets/images/mypage.svg';

function TabSVG({
  Component, color, size,
}: {
  Component: React.ComponentType<{ width?: number; height?: number; fill?: string; stroke?: string; color?: string }>;
  color: string; size: number;
}) {
  return <Component width={size} height={size} fill={color} stroke={color} color={color} />;
}

const ICON_INACTIVE = '#FDE68A';
const ICON_ACTIVE = '#FB923C';
const LABEL_COLOR = '#030712';

const ICON_BASE = 22;
const MATCH_ICON = 45;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? 10 : 8);
  const barHeight = 50 + bottomPad;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ICON_ACTIVE,
        tabBarInactiveTintColor: ICON_INACTIVE,
        tabBarStyle: {
          height: barHeight,
          paddingBottom: bottomPad,
          paddingTop: 6,
          backgroundColor: '#fff',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: '#EAEAEA',
        },
        tabBarItemStyle: { flex: 1 },
        tabBarLabel: ({ children }) => (
          <Text style={{ fontSize: 12, color: LABEL_COLOR }}>{children}</Text>
        ),
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <TabSVG Component={HomeIcon} color={color} size={ICON_BASE} />,
        }}
      />
      <Tabs.Screen
        name="partner"
        options={{
          title: '제휴',
          tabBarIcon: ({ color }) => <TabSVG Component={StoreIcon} color={color} size={ICON_BASE} />,
        }}
      />
      <Tabs.Screen
        name="match"
        options={{
          title: '매칭',
          tabBarIcon: ({ color }) => <TabSVG Component={MatchIcon} color={color} size={MATCH_ICON} />,
        }}
      />

      {/* ✅ 마이페이지: 탭을 누르든, 다른 곳에서 이동해 오든 포커스되면 항상 루트로 */}
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이페이지',
          tabBarIcon: ({ color }) => <TabSVG Component={MyPageIcon} color={color} size={ICON_BASE} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();                 // 기본(마지막 화면 유지) 동작 차단
            router.replace('/(tabs)/mypage');   // 탭을 눌렀을 때 항상 루트로
          },
          focus: () => {
            // 어떤 경로로 오더라도 탭이 활성화되면 루트로 정렬
            router.replace('/(tabs)/mypage');
          },
        }}
      />

      {/* 숨김 라우트 (탭엔 표시 안 됨) */}
      <Tabs.Screen name="saved-places" options={{ href: null }} />
      <Tabs.Screen name="account-settings" options={{ href: null }} />
      <Tabs.Screen name="account/change-email" options={{ href: null }} />
      <Tabs.Screen name="account/change-password" options={{ href: null }} />
      <Tabs.Screen name="account/change-school" options={{ href: null }} />
    </Tabs>
  );
}
