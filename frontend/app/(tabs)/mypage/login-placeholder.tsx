// app/(tabs)/mypage/login-placeholder.tsx
import * as React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import BackButton from '../../../components/BackButton';
import { applyLoginUser } from '../../../hooks/useUser';

const TEXT = '#29323A';
const MUTED = '#6B7280';
const ORANGE = '#FB923C';
const DIVIDER = '#EEE';

export default function LoginPlaceholder() {
  const insets = useSafeAreaInsets();

  const simulateLogin = () => {
    // 샘플 사용자로 로그인 상태 주입 (테스트용)
    applyLoginUser({
      name: '성신수정',
      handle: 'SungShin',
      avatarUrl: null, // 필요하면 임의 URL
    });
    router.replace('/(tabs)/mypage' as const); // 로그인 후 마이페이지로 복귀
  };

  return (
    <SafeAreaView style={s.safe} edges={['left', 'right', 'bottom']}>
      <View style={{ flex: 1, paddingTop: insets.top + 24 }}>
        {/* 헤더 */}
        <View style={s.header}>
          <View style={s.headerLeft}><BackButton /></View>
          <View style={s.headerCenter}><Text style={s.headerTitle}>로그인(임시)</Text></View>
          <View style={s.headerRight} />
        </View>

        <View style={s.body}>
          <Text style={s.desc}>
            실제 로그인 화면이 준비되기 전까지 사용하는 임시 페이지입니다.
          </Text>

          <Pressable style={s.loginBtn} onPress={simulateLogin}>
            <Text style={s.loginBtnText}>샘플 계정으로 로그인</Text>
          </Pressable>

          <Pressable style={s.cancelBtn} onPress={() => router.back()}>
            <Text style={s.cancelText}>돌아가기</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 10,
  },
  headerLeft: { width: 44, alignItems: 'flex-start', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerRight: { width: 44 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: TEXT },

  body: { flex: 1, padding: 16, gap: 16, alignItems: 'center' },
  desc: { fontSize: 13, color: MUTED, textAlign: 'center' },

  loginBtn: {
    marginTop: 4, height: 44, paddingHorizontal: 20,
    borderRadius: 12, backgroundColor: ORANGE,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'stretch',
  },
  loginBtnText: { color: '#fff', fontWeight: '700' },

  cancelBtn: {
    height: 44, paddingHorizontal: 20, borderRadius: 12,
    borderWidth: 1, borderColor: DIVIDER, alignItems: 'center',
    justifyContent: 'center', alignSelf: 'stretch',
  },
  cancelText: { color: MUTED, fontWeight: '600' },
});
