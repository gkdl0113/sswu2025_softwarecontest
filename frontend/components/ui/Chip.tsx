import { Pressable, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  // 테마 커스터마이즈가 필요하면 아래 색상 prop으로 덮어쓸 수 있어요(선택)
  bgColor?: string;
  textColor?: string;
  selectedBgColor?: string;
  selectedTextColor?: string;
};

export default function Chip({
  label,
  selected = false,
  onPress,
  bgColor = '#FFEFDE',
  textColor = '#EA580C',
  selectedBgColor = '#EA580C',
  selectedTextColor = '#FFFFFF',
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.chip,
        { backgroundColor: selected ? selectedBgColor : bgColor },
        pressed && { opacity: 0.85 },
      ]}
      hitSlop={8}
    >
      <Text style={[s.txt, { color: selected ? selectedTextColor : textColor }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: 'flex-start', // 내용 길이에 맞춰 가변 폭
  },
  txt: { fontSize: 13, fontWeight: '600' },
});
