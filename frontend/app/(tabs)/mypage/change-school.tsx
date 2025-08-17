// app/(tabs)/mypage/change-school.tsx
import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
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

const RESEND_SEC = 60;

export default function ChangeSchoolScreen() {
  const insets = useSafeAreaInsets();

  // 폼 상태
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  // 진행 상태
  const [sending, setSending] = useState(false);     // 코드 전송 중
  const [verifying, setVerifying] = useState(false); // 코드 확인 중
  const [saving, setSaving] = useState(false);       // 최종 저장 중
  const [codeSent, setCodeSent] = useState(false);   // 코드가 전송되었는지
  const [verified, setVerified] = useState(false);   // 코드 인증 완료

  // 재전송 타이머
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [left]);

  // 유효성
  const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());
  const schoolOk = school.trim().length >= 2;
  const codeOk = code.trim().length >= 6; // 6자리 가정
  const canSend = schoolOk && emailOk && !sending && left === 0;
  const canVerify = codeSent && codeOk && !verifying && !verified;
  const canSave = verified && !saving;

  // --- 서버 연동 위치들 ---
  const sendCode = async () => {
    if (!canSend) return;
    setSending(true);
    try {
      // TODO: 서버 요청 (인증코드 발송)
      // await api.post('/auth/school-email/send', { school, email });
      await new Promise((r) => setTimeout(r, 600)); // 데모 지연
      setCodeSent(true);
      setLeft(RESEND_SEC); // 재전송 쿨다운
    } catch (e) {
      // TODO: 에러 처리 (Alert/Toast)
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async () => {
    if (!canVerify) return;
    setVerifying(true);
    try {
      // TODO: 서버 요청 (코드 검증)
      // await api.post('/auth/school-email/verify', { email, code });
      await new Promise((r) => setTimeout(r, 600)); // 데모 지연
      setVerified(true);
    } catch (e) {
      // TODO: 에러 처리 (Alert/Toast)
    } finally {
      setVerifying(false);
    }
  };

  const saveAll = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      // TODO: 서버 요청 (학교 변경 저장 + 제휴사 연결 트리거)
      // await api.patch('/me/school', { school, email });
      // await api.post('/partners/link', { universityDomain: ... });
      await new Promise((r) => setTimeout(r, 700)); // 데모 지연

      // 저장 성공 → 마이페이지 루트로 이동 (스택 정리)
      router.replace('/(tabs)/mypage');
    } catch (e) {
      // TODO: 에러 처리 (Alert/Toast)
    } finally {
      setSaving(false);
    }
  };

  const resendLabel = useMemo(() => {
    return left > 0 ? `재전송 (${left}s)` : '코드 재전송';
  }, [left]);

  return (
    <SafeAreaView style={s.safe} edges={['left', 'right', 'bottom']}>
      <View style={{ flex: 1, paddingTop: insets.top + 16 }}>
        {/* 헤더 */}
        <View style={s.header}>
          <View style={s.headerLeft}><BackButton /></View>
          <View style={s.headerCenter}><Text style={s.headerTitle}>학교 변경</Text></View>
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
            {/* 학교 */}
            <View style={s.field}>
              <Text style={s.label}>학교</Text>
              <TextInput
                style={[s.input, !schoolOk && school !== '' && s.inputError]}
                placeholder="예: 성신여자대학교"
                placeholderTextColor={MUTED}
                value={school}
                onChangeText={setSchool}
                autoCapitalize="words"
                returnKeyType="next"
                selectionColor={ORANGE}
              />
              {!schoolOk && school !== '' && (
                <Text style={s.helpError}>학교명을 2자 이상 입력해 주세요.</Text>
              )}
            </View>

            {/* 대학 이메일 */}
            <View style={s.field}>
              <Text style={s.label}>대학 이메일</Text>
              <TextInput
                style={[s.input, !emailOk && email !== '' && s.inputError]}
                placeholder="you@univ.ac.kr"
                placeholderTextColor={MUTED}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                returnKeyType="done"
                selectionColor={ORANGE}
              />
              {!emailOk && email !== '' && (
                <Text style={s.helpError}>이메일 형식을 확인해 주세요.</Text>
              )}
            </View>

            {/* 인증 코드 전송/재전송 */}
            <Pressable
              style={[s.actionBtn, !canSend && s.btnDisabled]}
              onPress={sendCode}
              disabled={!canSend}
              hitSlop={8}
            >
              {sending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.actionBtnText}>{codeSent ? resendLabel : '인증코드 보내기'}</Text>
              )}
            </Pressable>

            {/* 코드 입력 + 확인 */}
            {codeSent && (
              <>
                <View style={s.field}>
                  <Text style={s.label}>인증 코드</Text>
                  <TextInput
                    style={[s.input, !codeOk && code !== '' && s.inputError]}
                    placeholder="6자리 숫자"
                    placeholderTextColor={MUTED}
                    value={code}
                    onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
                    keyboardType="numeric"
                    returnKeyType="done"
                    selectionColor={ORANGE}
                  />
                  {!codeOk && code !== '' && (
                    <Text style={s.helpError}>6자리 코드를 입력해 주세요.</Text>
                  )}
                </View>

                <Pressable
                  style={[s.verifyBtn, !canVerify && s.btnDisabled]}
                  onPress={verifyCode}
                  disabled={!canVerify}
                  hitSlop={8}
                >
                  {verifying ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={s.verifyBtnText}>코드 확인</Text>
                  )}
                </Pressable>

                {verified && (
                  <View style={s.noticeOk}>
                    <Text style={s.noticeOkText}>인증이 완료되었습니다.</Text>
                  </View>
                )}
              </>
            )}

            {/* 최종 저장 */}
            <Pressable
              style={[s.saveBtn, !canSave && s.btnDisabled]}
              onPress={saveAll}
              disabled={!canSave}
              hitSlop={8}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.saveBtnText}>저장</Text>
              )}
            </Pressable>

            <Text style={s.footerNote}>
              대학 이메일 인증 후 제휴 혜택이 자동으로 연결됩니다.
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

  body: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 14 },

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

  actionBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    marginTop: 4,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  actionBtnText: { color: '#fff', fontWeight: '700' },
  verifyBtnText: { color: '#fff', fontWeight: '700' },
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
