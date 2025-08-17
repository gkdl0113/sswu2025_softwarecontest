// app/(tabs)/mypage/change-password.tsx
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

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();

  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 간단 유효성 규칙 (필요 시 강화)
  const curOk = curPw.length >= 4;
  const newOk = newPw.length >= 8; // 예: 최소 8자
  const matchOk = newPw === confirmPw && confirmPw.length > 0;
  const formOk = curOk && newOk && matchOk && !submitting;

  const onSave = async () => {
    if (!formOk) return;
    setSubmitting(true);
    try {
      // TODO: 서버 호출 예시
      // await api.patch('/me/password', { curPw, newPw });
      await new Promise(r => setTimeout(r, 700)); // 데모 지연

      // 저장 성공 → 마이페이지 루트로 이동 (스택 정리)
      router.replace('/(tabs)/mypage');
    } catch (e) {
      // TODO: 에러 처리 (Alert/Toast)
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
          <View style={s.headerCenter}><Text style={s.headerTitle}>비밀번호 변경</Text></View>
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
            {/* 현재 비밀번호 */}
            <View style={s.field}>
              <Text style={s.label}>현재 비밀번호</Text>
              <TextInput
                style={[s.input, !curOk && curPw !== '' && s.inputError]}
                placeholder="현재 비밀번호"
                placeholderTextColor={MUTED}
                secureTextEntry
                value={curPw}
                onChangeText={setCurPw}
                returnKeyType="next"
                selectionColor={ORANGE}
              />
              {!curOk && curPw !== '' && (
                <Text style={s.helpError}>비밀번호를 입력해 주세요.</Text>
              )}
            </View>

            {/* 새 비밀번호 */}
            <View style={s.field}>
              <Text style={s.label}>새 비밀번호</Text>
              <TextInput
                style={[s.input, !newOk && newPw !== '' && s.inputError]}
                placeholder="새 비밀번호 (8자 이상)"
                placeholderTextColor={MUTED}
                secureTextEntry
                value={newPw}
                onChangeText={setNewPw}
                returnKeyType="next"
                selectionColor={ORANGE}
              />
              {!newOk && newPw !== '' && (
                <Text style={s.helpError}>8자 이상으로 입력해 주세요.</Text>
              )}
            </View>

            {/* 새 비밀번호 확인 */}
            <View style={s.field}>
              <Text style={s.label}>새 비밀번호 확인</Text>
              <TextInput
                style={[s.input, !matchOk && confirmPw !== '' && s.inputError]}
                placeholder="새 비밀번호 확인"
                placeholderTextColor={MUTED}
                secureTextEntry
                value={confirmPw}
                onChangeText={setConfirmPw}
                returnKeyType="done"
                selectionColor={ORANGE}
              />
              {!matchOk && confirmPw !== '' && (
                <Text style={s.helpError}>비밀번호가 일치하지 않습니다.</Text>
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

            {/* 안내 */}
            <Text style={s.footerNote}>
              저장 후 보안을 위해 다시 로그인할 수 있어요.
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
});
