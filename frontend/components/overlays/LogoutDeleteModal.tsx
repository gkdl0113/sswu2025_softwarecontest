// components/overlays/LogoutDeleteModal.tsx
import * as React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

const ORANGE = '#FB923C';
const TEXT = '#29323A';
const MUTED = '#6B7280';
const DIVIDER = '#EEE';
const ERROR = '#EF4444';

export type LogoutDeleteModalProps = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onDelete: () => void;
};

export default function LogoutDeleteModal({
  visible,
  onClose,
  onLogout,
  onDelete,
}: LogoutDeleteModalProps) {
  const [confirm, setConfirm] = React.useState<string>('');

  // 모달이 닫히면 입력값 초기화
  React.useEffect(() => {
    if (!visible) setConfirm('');
  }, [visible]);

  const canDelete = confirm.trim() === '삭제';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={s.backdrop}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={s.card}>
              <Text style={s.title}>로그아웃 하시겠습니까?</Text>
              <Text style={s.desc}>
                탈퇴를 희망하는 경우 아래 입력란에 <Text style={s.bold}>‘삭제’</Text>를 입력한 뒤
                <Text style={s.bold}> 삭제</Text> 버튼을 눌러주세요.
              </Text>

              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                placeholder="삭제"
                placeholderTextColor={MUTED}
                style={[s.input, confirm.length > 0 && !canDelete && s.inputWarn]}
                autoCapitalize="none"
                autoCorrect={false}
                selectionColor={ORANGE}
                returnKeyType="done"
              />

              {/* 동일 크기의 버튼 두 개 */}
              <View style={s.row}>
                <Pressable
                  style={[s.btn, s.darkBtn, !canDelete && s.btnDisabled]}
                  onPress={onDelete}
                  disabled={!canDelete}
                  hitSlop={8}
                >
                  <Text style={s.darkText}>삭제</Text>
                </Pressable>

                <Pressable
                  style={[s.btn, s.orangeBtn]}
                  onPress={onLogout}
                  hitSlop={8}
                >
                  <Text style={s.orangeText}>로그아웃</Text>
                </Pressable>
              </View>

              {/* 하단 닫기 */}
              <Pressable onPress={onClose} style={s.closeTap} hitSlop={8}>
                <Text style={s.closeText}>닫기</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  title: { fontSize: 14, fontWeight: '700', color: TEXT },
  desc: { marginTop: 6, fontSize: 12, color: MUTED, lineHeight: 18 },
  bold: { fontWeight: '700', color: TEXT },

  input: {
    marginTop: 12,
    height: 44,
    borderWidth: 1,
    borderColor: DIVIDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: TEXT,
    backgroundColor: '#fff',
  },
  inputWarn: {
    borderColor: ERROR,
  },

  row: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
  },

  // 공통 버튼: 동일 크기
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.6 },

  darkBtn: { backgroundColor: '#111827' },
  darkText: { color: '#fff', fontWeight: '700' },

  orangeBtn: { backgroundColor: ORANGE },
  orangeText: { color: '#fff', fontWeight: '700' },

  closeTap: { alignSelf: 'center', marginTop: 10, paddingVertical: 6, paddingHorizontal: 10 },
  closeText: { color: MUTED, fontSize: 12, fontWeight: '600' },
});
