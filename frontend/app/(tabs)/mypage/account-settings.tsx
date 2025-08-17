// app/(tabs)/mypage/account-settings.tsx
import * as React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../../../components/BackButton';
import { router } from 'expo-router';

const ORANGE = '#FB923C';
const TEXT = '#29323A';
const MUTED = '#6B7280';
const DIVIDER = '#EEE';

export default function AccountSettingsScreen() {
  const insets = useSafeAreaInsets();

  const onEditProfile = () => {
    // TODO: 프로필(아바타/닉네임 등) 편집 화면으로 이동
    // router.push('profile-edit' as const)
  };

  return (
    <SafeAreaView style={s.safe} edges={['left', 'right', 'bottom']}>
      <View style={{ flex: 1, paddingTop: insets.top + 16 }}>
        {/* 헤더: 왼쪽 백버튼 / 가운데 타이틀 / 오른쪽 더미 */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <BackButton />
          </View>
          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>내 정보 변경</Text>
          </View>
          <View style={s.headerRight} />
        </View>

        {/* ▲ index.tsx와 동일한 상단 프로필 카드 */}
        <View style={s.profileBox}>
          <View style={s.avatarWrap}>
            <View style={[s.avatar, { backgroundColor: '#F6E7D9' }]}>
              <Ionicons name="person" size={36} color={ORANGE} />
            </View>

            <Pressable style={s.editBadge} onPress={onEditProfile} hitSlop={8}>
              <View style={s.editBadgeInner}>
                <Ionicons name="pencil" size={12} color="#fff" />
              </View>
            </Pressable>
          </View>

          <Text style={s.name}>성신수정</Text>
          <Text style={s.username}>@SungShin</Text>
        </View>

        {/* ▼ 하단 바(리스트) */}
        <View style={s.list}>
          <RowItem
            label="아이디/이메일 변경"
            onPress={() => router.push('/(tabs)/mypage/change-id-email' as const)}
          />
          <RowItem
            label="비밀번호 변경"
            onPress={() => router.push('/(tabs)/mypage/change-password' as const)}
          />
          <RowItem
            label="학교 변경"
            onPress={() => router.push('/(tabs)/mypage/change-school'as const)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function RowItem({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.row, pressed && s.rowPressed]}>
      <Text style={s.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#B5BAC1" />
    </Pressable>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },

  // 헤더 3-칼럼
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 16,
  },
  headerLeft: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: 44,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
  },

  // index와 동일한 프로필 카드
  profileBox: {
    alignItems: 'center',
    paddingVertical: 18,
    gap: 6,
  },
  avatarWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
  },
  editBadgeInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: { fontSize: 16, fontWeight: '700', color: TEXT, marginTop: 6 },
  username: { fontSize: 12, color: MUTED },

  // 하단 리스트 바 3개
  list: {
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: DIVIDER,
    backgroundColor: '#fff',
  },
  row: {
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DIVIDER,
    backgroundColor: '#fff',
  },
  rowPressed: { backgroundColor: '#FAFAFA' },
  rowLabel: { fontSize: 14, color: TEXT },
});
