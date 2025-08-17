// app/(tabs)/index.tsx
import * as React from 'react';
import { useMemo, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import FilterSheet from '../../components/filters/FilterSheet';
import MapMock from '../../components/map/MapMock';
import Chip from '../../components/ui/Chip';
import SearchBar from '../../components/ui/SearchBar';
import Logo from '../../assets/images/Logo.svg';
import { PlaceResultModal } from '../../components/overlays/PlaceResultModal';

import type { Filters } from '../../components/filters/FilterSheet';
import type { Place } from '../../components/types/place';
import type { MockItem } from '../../components/map/MapMock';

const CATEGORIES: string[] = ['일식', '한식', '양식', '중식', '분식', '다이어트', '카공', '혼밥/가성비'];

const MOCK = [
  { id: 1, name: '라멘집', cats: ['일식'] },
  { id: 2, name: '분식집', cats: ['분식'] },
  { id: 3, name: '홍콩반점', cats: ['중식'] },
  { id: 4, name: '돈가스', cats: ['일식'] },
  { id: 5, name: '샐러드', cats: ['다이어트'] },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  // 검색/카테고리 선택
  const [q, setQ] = useState('');
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const listRef = useRef<FlatList<string>>(null);

  // 필터 모달
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: [],
    priceRange: [1000, 100000],
    keywords: [],
    distanceRange: [100, 10000],
    rating: [],
  });

  const handleApplyFilters = (f: Filters) => {
    setFilters(f);
    // TODO: 서버 쿼리/지도 마커 갱신
  };

  // 공통 결과 모달
  const [resultOpen, setResultOpen] = useState(false);
  const [resultPlace, setResultPlace] = useState<Place | null>(null);

  const showResult = useCallback((p: Place) => {
    setResultPlace(p);
    setResultOpen(true);
  }, []);
  const closeResult = useCallback(() => setResultOpen(false), []);

  // 지도 이동 콜백 — Kakao/MapView 붙일 때 연결
  const focusMap = useCallback((p: Place) => {
    // TODO: mapRef.current?.animateToRegion(...)
  }, []);

  // 필터 시트의 랜덤 추천 버튼 처리
  const handleRandom = useCallback((f: Filters) => {
    const rec: Place = {
      id: 99901, // ✅ number로 통일
      name: '성신파스타',
      category: '양식',
      lat: 37.5895,
      lng: 127.0167,
      distanceM: 589,
      openTimeText: '07:30 영업시작',
      address: '서울 성북구 어쩌고저쩌고 주소',
      desc: '기타 설명 / 리뷰',
    };
    showResult(rec);
  }, [showResult]);

  // 카테고리 칩 토글(선택 시 왼쪽 스크롤)
  const toggleCat = useCallback((c: string) => {
    setSelectedCats(prev => {
      const next = new Set(prev);
      const willSelect = !next.has(c);
      willSelect ? next.add(c) : next.delete(c);
      if (willSelect) {
        requestAnimationFrame(() => {
          listRef.current?.scrollToOffset?.({ offset: 0, animated: true });
        });
      }
      return next;
    });
  }, []);

  // 선택칩 먼저 보이도록 정렬
  const sortedCategories: string[] = useMemo(() => {
    const sel: string[] = [];
    const rest: string[] = [];
    for (const c of CATEGORIES) (selectedCats.has(c) ? sel : rest).push(c);
    return [...sel, ...rest];
  }, [selectedCats]);

  const firstUnselectedIndex = useMemo(() => {
    let count = 0;
    for (const c of CATEGORIES) if (selectedCats.has(c)) count++;
    return count;
  }, [selectedCats]);

  // 더미 지도 핀 데이터(상대좌표 0~1) — ✅ id를 number로 통일
  const dummyItems: MockItem[] = useMemo(() => {
    const base: Place[] = [
      { id: 101, name: '라멘집', category: '일식', lat: 37.558, lng: 126.998 },
      { id: 102, name: '성신파스타', category: '양식', lat: 37.5895, lng: 127.0167, distanceM: 589, openTimeText: '07:30 영업시작' },
      { id: 103, name: '홍콩반점', category: '중식', lat: 37.559, lng: 127.002 },
      { id: 104, name: '분식집', category: '분식', lat: 37.556, lng: 126.995 },
      { id: 105, name: '샐러드', category: '다이어트', lat: 37.557, lng: 127.0 },
    ];
    const pos = [
      { x: 0.25, y: 0.28 },
      { x: 0.55, y: 0.18 },
      { x: 0.40, y: 0.42 },
      { x: 0.62, y: 0.36 },
      { x: 0.30, y: 0.60 },
    ];
    return base.map((place, i) => ({ place, ...pos[i % pos.length] }));
  }, []);

  // 렌더 함수에 타입을 명시 (item: string)
  const renderCategory: ListRenderItem<string> = ({ item, index }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {index === firstUnselectedIndex && selectedCats.size > 0 && <View style={{ width: 8 }} />}
      <Chip label={item} selected={selectedCats.has(item)} onPress={() => toggleCat(item)} />
    </View>
  );

  return (
    <SafeAreaView style={s.safe} edges={['left', 'right']}>
      <View style={{ flex: 1, paddingTop: Math.max(insets.top + 20) }}>
        {/* 상단: 로고 + 검색(필터 버튼 포함) */}
        <View style={s.header}>
          <Logo width={28} height={28} />
          <SearchBar value={q} onChange={setQ} onFilterPress={() => setSheetOpen(true)} />
        </View>

        {/* 카테고리 칩 */}
        <FlatList<string>
          ref={listRef}
          data={sortedCategories}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chips}
          style={{ flexGrow: 0 }}
          renderItem={renderCategory}
        />

        {/* 지도 (하단까지 꽉) */}
        <View style={s.mapArea}>
          <MapMock
            items={dummyItems}
            onPinPress={showResult}
            background={require('../../assets/images/map_mock.png')}
            pinImage={require('../../assets/images/LocationPin.png')}  // 👈 PNG 사용
          />
        </View>

        {/* 필터 모달 */}
        <FilterSheet
          visible={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onApply={handleApplyFilters}
          onRandom={handleRandom}
          initial={filters}
        />

        {/* 공통 결과 모달 */}
        <PlaceResultModal
          visible={resultOpen}
          place={resultPlace}
          onClose={closeResult}
          onSave={(p) => { /* TODO: 저장 후 토스트 등 */ }}
          onNavigate={(p) => { /* TODO: 길안내 */ }}
          onFocusMap={focusMap}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  chips: { paddingHorizontal: 16, paddingVertical: 8 },
  mapArea: {
    flex: 1,
    backgroundColor: '#F2F3F5',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
});
