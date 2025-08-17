// app/(tabs)/mypage/my-reviews.tsx
import * as React from 'react';
import { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../../../components/BackButton';

const ORANGE = '#FB923C';
const TEXT = '#29323A';
const MUTED = '#6B7280';
const DIVIDER = '#EEE';
const ROW_BG = '#FFFFFF';
const INPUT_BG = '#F3F4F6';

type Review = {
  id: string;
  title: string;
  summary: string;
  image?: string | null;
  comments: number;
  timeText: string; // 예: '2시간 전', '어제'
};

// 더미 데이터
const MOCK: Review[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `r${i + 1}`,
  title: i % 2 ? '성신파스타 방문기' : '성신빵집 솔직 후기',
  summary:
    i % 2
      ? '분위기가 좋아요. 양도 넉넉하고 크림 파스타 추천합니다!'
      : '빵이 촉촉하고 너무 맛있어요. 특히 크루아상 강추!',
  image: i % 3 === 0 ? null : undefined, // null/undefined이면 플레이스홀더
  comments: 100 + i,
  timeText: i % 2 ? '어제' : '2시간 전',
}));

export default function MyReviewsScreen() {
  const insets = useSafeAreaInsets();

  const [q, setQ] = useState('');
  const onChangeQ = useCallback((text: string) => setQ(text), []);

  const filtered = useMemo(() => {
    if (!q.trim()) return MOCK;
    const key = q.trim();
    return MOCK.filter(
      (r) => r.title.includes(key) || r.summary.includes(key)
    );
  }, [q]);

  const renderItem = useCallback(({ item }: { item: Review }) => {
    return (
      <Pressable style={({ pressed }) => [s.card, pressed && s.cardPressed]}>
        <View style={s.cardText}>
          <Text numberOfLines={1} style={s.title}>
            {item.title}
          </Text>
          <Text numberOfLines={2} style={s.summary}>
            {item.summary}
          </Text>

        <View style={s.metaRow}>
            <Ionicons name="chatbubble-outline" size={14} color={MUTED} />
            <Text style={s.metaText}>{item.comments}+</Text>
            <Text style={[s.metaText, { marginLeft: 6 }]}>{item.timeText}</Text>
          </View>
        </View>

        <View style={s.thumbWrap}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={s.thumb} />
          ) : (
            <View style={[s.thumb, s.thumbPlaceholder]} />
          )}
        </View>
      </Pressable>
    );
  }, []);

  return (
    // ✅ bottom 제외: 탭바 아래로 여백 생기지 않게
    <SafeAreaView style={s.safe} edges={['left', 'right']}>
      <View style={{ flex: 1, paddingTop: insets.top + 16 }}>
        {/* 헤더: 좌 Back / 가운데 타이틀 / 우 더미 */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <BackButton />
          </View>
          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>내가 작성한 리뷰 내역</Text>
          </View>
          <View style={s.headerRight} />
        </View>

        {/* 상단 검색바 */}
        <View style={s.searchBar}>
          <Ionicons name="search" size={18} color={MUTED} />
          <TextInput
            value={q}
            onChangeText={onChangeQ}
            placeholder="검색"
            placeholderTextColor={MUTED}
            style={s.searchInput}
            returnKeyType="search"
          />
        </View>

        {/* 리스트 */}
        <FlatList
          data={filtered}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={s.listContent} // ↓ 버튼 공간 만큼만 확보
          showsVerticalScrollIndicator={false}
        />

        {/* 하단 '칩' 느낌의 작은 글쓰기 버튼 */}
        <Pressable style={({ pressed }) => [s.fab, pressed && s.fabPressed]}>
          <Ionicons name="pencil" size={14} color="#fff" />
          <Text style={s.fabText}>글쓰기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  // 헤더 3-칼럼 (다른 마이페이지 화면과 동일 규격)
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

  // 검색바
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG,
    marginHorizontal: 16,
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 10,
    gap: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    color: TEXT,
    paddingVertical: 0,
    fontSize: 14,
  },

  // 리스트
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 72, // ⬅ 기존 96 → 72 (작아진 버튼만큼 여유)
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ROW_BG,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: DIVIDER,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 8,
    marginVertical: 6,
  },
  cardPressed: { backgroundColor: '#FAFAFA' },
  cardText: { flex: 1, paddingRight: 12 },
  title: { fontSize: 15, fontWeight: '700', color: TEXT },
  summary: { fontSize: 13, color: '#374151', marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  metaText: { fontSize: 12, color: MUTED, marginLeft: 4 },

  thumbWrap: { width: 56, height: 56, borderRadius: 10, overflow: 'hidden' },
  thumb: { width: '100%', height: '100%' },
  thumbPlaceholder: { backgroundColor: '#E5E7EB' },

  // FAB → '칩' 형태로 축소
  fab: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',     // 중앙 고정
    flexDirection: 'row',
    backgroundColor: ORANGE,
    paddingHorizontal: 14,   // 가로폭: 텍스트만큼 + 패딩
    paddingVertical: 8,
    borderRadius: 18,        // 칩 느낌
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    // 그림자
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  fabPressed: { opacity: 0.9 },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
