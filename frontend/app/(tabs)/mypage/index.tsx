// app/(tabs)/mypage/index.tsx
import * as React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import LogoutDeleteModal from '../../../components/overlays/LogoutDeleteModal';
import { useUser } from '../../../hooks/useUser';

const ORANGE = '#FB923C';
const TEXT = '#29323A';
const MUTED = '#6B7280';
const DIVIDER = '#EEE';

export default function MyPageScreen() {
  const [dangerOpen, setDangerOpen] = React.useState(false);

  const user = useUser((s) => s.user);
  const resetToGuest = useUser((s) => s.resetToGuest);
  // 프로젝트의 zustand 액션 이름에 맞춰 사용하세요.
  const setAvatarUrl = useUser((s: any) => s.setAvatarUrl);
  const isLoggedIn = user.id !== 'guest' && !!user.handle;

  // 연필 아이콘을 눌렀을 때: 갤러리에서 이미지 선택 → 아바타 저장
  const pickProfilePhoto = React.useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '갤러리 접근 권한을 허용해 주세요.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],   // 아바타 정사각형 크롭
        quality: 0.9,
        selectionLimit: 1,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      if (typeof setAvatarUrl === 'function') {
        setAvatarUrl(asset.uri);
      } else {
        // fallback: 스토어 구조에 맞게 변경하세요.
        useUser.setState((s: any) => ({ user: { ...s.user, avatarUrl: asset.uri } }));
      }
      // TODO: 서버 업로드가 필요하면 여기서 업로드 후, 업로드 URL을 저장
    } catch (e) {
      console.warn(e);
      Alert.alert('오류', '프로필 사진을 변경하는 중 문제가 발생했습니다.');
    }
  }, [setAvatarUrl]);

  const handleLogout = async () => {
    try {
      resetToGuest();
      setDangerOpen(false);
    } catch (e) {}
  };

  const handleDelete = async () => {
    try {
      resetToGuest();
      setDangerOpen(false);
    } catch (e) {}
  };

  const goLoginTemp = () => {
    router.push('/(tabs)/mypage/login-placeholder' as const);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top','left','right','bottom']}>
      <View style={{ flex: 1, paddingTop: 24 }}>
        {/* 헤더 (루트이므로 BackButton 제거) */}
        <View style={s.header}>
          <View style={s.headerLeft} />
          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>마이페이지</Text>
          </View>
          <View style={s.headerRight} />
        </View>

        {/* 프로필 카드 */}
        <View style={s.profileBox}>
          <View style={s.avatarWrap}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={s.avatar} />
            ) : (
              <View style={[s.avatar, { backgroundColor: '#F6E7D9' }]}>
                <Ionicons name="person" size={36} color={ORANGE} />
              </View>
            )}

            {/* ✅ 연필 아이콘 = 프로필 사진 변경 트리거 */}
            <Pressable style={s.editBadge} onPress={pickProfilePhoto} hitSlop={8}>
              <View style={s.editBadgeInner}>
                <Ionicons name="pencil" size={12} color="#fff" />
              </View>
            </Pressable>
          </View>

          {isLoggedIn ? (
            <Text style={s.name}>{user.name}</Text>
          ) : (
            <Pressable onPress={goLoginTemp} hitSlop={8}>
              <Text style={[s.name, s.loginLink]}>로그인 하러 가기</Text>
            </Pressable>
          )}

          {isLoggedIn && user.handle ? (
            <Text style={s.username}>@{user.handle}</Text>
          ) : (
            <Text style={[s.username, s.usernameEmpty]}>로그인하세요</Text>
          )}
        </View>

        {/* 메뉴 리스트 */}
        <View style={s.list}>
          <RowItem
            label="내가 저장한 맛집"
            onPress={() => router.push('/(tabs)/mypage/saved-places' as const)}
          />
          <RowItem
            label="내가 작성한 리뷰 내역"
            onPress={() => router.push('/(tabs)/mypage/my-reviews' as const)}
          />
          <RowItem
            label="내 정보 변경"
            onPress={() => router.push('/(tabs)/mypage/account-settings' as const)}
          />
          <RowItem label="로그아웃/탈퇴" onPress={() => setDangerOpen(true)} />
        </View>
      </View>

      <LogoutDeleteModal
        visible={dangerOpen}
        onClose={() => setDangerOpen(false)}
        onLogout={handleLogout}
        onDelete={handleDelete}
      />
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerLeft: { width: 44, alignItems: 'flex-start', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerRight: { width: 44 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: TEXT },

  profileBox: { alignItems: 'center', paddingVertical: 18, gap: 6, position: 'relative' },
  avatarWrap: {
    width: 84, height: 84, borderRadius: 42, position: 'relative',
    alignItems: 'center', justifyContent: 'center',
  },
  avatar: {
    width: 84, height: 84, borderRadius: 42,
    alignItems: 'center', justifyContent: 'center',
  },
  editBadge: { position: 'absolute', right: -2, bottom: -2 },
  editBadgeInner: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: ORANGE,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff',
  },

  name: { fontSize: 16, fontWeight: '700', color: TEXT, marginTop: 6 },
  loginLink: { textDecorationLine: 'underline', color: ORANGE },
  username: { fontSize: 12, color: MUTED },
  usernameEmpty: { minHeight: 16 },

  list: {
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: DIVIDER,
  },
  row: {
    minHeight: 48,
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
