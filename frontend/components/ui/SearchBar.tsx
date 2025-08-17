// components/SearchBar.tsx
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({
  value, onChange, onFilterPress,
}: {
  value: string;
  onChange: (t: string) => void;
  onFilterPress?: () => void; // ⬅️ 필터 버튼 콜백
}) {
  return (
    <View style={s.wrap}>
      <Ionicons name="search" size={18} style={{ marginRight: 6 }} />
      <TextInput
        placeholder="검색"
        value={value}
        onChangeText={onChange}
        style={{ flex: 1, paddingVertical: 6 }}
        returnKeyType="search"
      />
      <Pressable onPress={onFilterPress} hitSlop={8} style={{ paddingLeft: 6 }}>
        <Ionicons name="options-outline" size={20} />
      </Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  wrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    paddingHorizontal: 10,
  },
});
