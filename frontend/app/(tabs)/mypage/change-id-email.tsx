// app/(tabs)/mypage/change-id-email.tsx
import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../../components/BackButton';
import { router } from 'expo-router';

const TEXT = '#29323A';
const MUTED = '#6B7280';
const DIVIDER = '#EEE';
const ORANGE = '#FB923C';
const ERROR = '#EF4444';
const OK = '#10B981';

export default function ChangeIdEmailScreen() {
  const insets = useSafeAreaInsets();

  // 폼 상태
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [curPw, setCurPw] = useState('');            // 보안상 현재 비번 확인
  const [submitting, setSubmitting] = useState(false);

  // 간단 유효성
  const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());
  const userIdOk = userId.trim().length >= 2;
  const pwOk = curPw.length >= 4;                    // 규칙에 맞게 조정 가능
  const formOk = emailOk && userIdOk && pwOk && !submitting;

  const onSave = async () => {
    if (!formOk) return;
    setSubmitting(true);
    try {
      // TODO: 서버 호출 예시
      // await api.patch('/me/credentials', { userId, email, curPw });
      await new Promise(r => setTimeout(r, 600)); // 데모 지연

      // 저장 성공 → 마이페이지 첫 화면으로 이동 (스택 정리 위해 replace)
      router.replace('/(tabs)/mypage');
    } catch (e) {
      // TODO: 에러 처리 (토스트/Alert)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['left', 'right', 'bottom']}>
      <View style={{ flex: 1, paddingTop: insets.top + 16 }}>
        {/* 헤더 */}
        <View style={s.header}>
          <View style={s.headerLeft}><BackButton /></View>
          <View style={s.headerCenter}><Text style={s.headerTitle}>아이디/이메일 변경</Text></View>
          <View style={s.headerRight} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={12}
        >
          <ScrollView
            contentContainerStyle={s.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* 아이디 */}
            <View style={s.field}>
              <Text style={s.label}>아이디</Text>
              <TextInput
                style={[s.input, !userIdOk && userId !== '' && s.inputError]}
                placeholder="새 아이디"
                placeholderTextColor={MUTED}
                value={userId}
                onChangeText={setUserId}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                selectionColor={ORANGE}
              />
              {!userIdOk && userId !== '' && (
                <Text style={s.helpError}>아이디는 2자 이상 입력해 주세요.</Text>
              )}
            </View>

            {/* 이메일 */}
            <View style={s.field}>
              <Text style={s.label}>이메일</Text>
              <TextInput
                style={[s.input, !emailOk && email !== '' && s.inputError]}
                placeholder="example@email.com"
                placeholderTextColor={MUTED}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                selectionColor={ORANGE}
              />
              {!emailOk && email !== '' && (
                <Text style={s.helpError}>이메일 형식을 확인해 주세요.</Text>
              )}
            </View>

            {/* 현재 비밀번호 확인 */}
            <View style={s.field}>
              <Text style={s.label}>현재 비밀번호</Text>
              <TextInput
                style={[s.input, !pwOk && curPw !== '' && s.inputError]}
                placeholder="현재 비밀번호"
                placeholderTextColor={MUTED}
                value={curPw}
                onChangeText={setCurPw}
                secureTextEntry
                returnKeyType="done"
                selectionColor={ORANGE}
              />
              {!pwOk && curPw !== '' && (
                <Text style={s.helpError}>비밀번호를 입력해 주세요.</Text>
              )}
            </View>

            {/* 저장 버튼 */}
            <Pressable
              style={[s.saveBtn, !formOk && s.saveBtnDisabled]}
              onPress={onSave}
              disabled={!formOk}
              hitSlop={8}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.saveBtnText}>저장</Text>
              )}
            </Pressable>

            <Text style={s.footerNote}>
              저장 시 보안을 위해 다시 로그인할 수 있어요.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
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
  headerLeft: { width: 44, alignItems: 'flex-start', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerRight: { width: 44 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: TEXT },

  body: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 14,
  },

  field: { gap: 6 },
  label: { fontSize: 12, color: MUTED },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: DIVIDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: TEXT,
    backgroundColor: '#fff',
  },
  inputError: { borderColor: ERROR },
  helpError: { fontSize: 12, color: ERROR },

  saveBtn: {
    marginTop: 8,
    height: 44,
    borderRadius: 12,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontWeight: '700' },

  footerNote: { marginTop: 4, fontSize: 12, color: MUTED, textAlign: 'center' },

  noticeOk: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  noticeOkText: { fontSize: 12, color: OK, textAlign: 'center', fontWeight: '600' },
});
