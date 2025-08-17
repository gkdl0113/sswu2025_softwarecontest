// app/(tabs)/mypage/saved-places.tsx
import * as React from 'react';
import { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import MapMock from '../../../components/map/MapMock';
import { PlaceResultModal } from '../../../components/overlays/PlaceResultModal';
import BackButton from '../../../components/BackButton';

import type { Place } from '../../../components/types/place';
import type { MockItem } from '../../../components/map/MapMock';
import { useSavedPlaces } from '../../../hooks/useSavedPlace'; // ✅ 전역 저장소 사용

const TEXT = '#29323A';
const MUTED = '#6B7280';

// 샘플 위치(0~1 상대좌표) — 저장된 아이템 수에 맞춰 순환 배치
const POS = [
  { x: 0.55, y: 0.18 },
  { x: 0.25, y: 0.28 },
  { x: 0.62, y: 0.36 },
  { x: 0.40, y: 0.42 },
];

export default function SavedPlacesScreen() {
  const insets = useSafeAreaInsets();

  // ✅ 전역 저장 목록에서 불러오기
  const saved = useSavedPlaces((s) => s.items);

  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<Place | null>(null);

  const showResult = useCallback((p: Place) => { setSelected(p); setVisible(true); }, []);
  const closeResult = useCallback(() => setVisible(false), []);

  // 지도 핀 데이터: 저장된 목록을 화면 좌표에 매핑
  const items: MockItem[] = useMemo(() => {
    return saved.map((place, i) => ({ place, ...POS[i % POS.length] }));
  }, [saved]);

  return (
    <SafeAreaView style={s.safe} edges={['left', 'right']}>
      <View style={{ flex: 1, paddingTop: insets.top + 16 }}>
        {/* 헤더 */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <BackButton />
          </View>
          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>내가 저장한 맛집</Text>
          </View>
          <View style={s.headerRight} />
        </View>

        {/* 콘텐츠 */}
        {items.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="bookmark-outline" size={28} color={MUTED} />
            <Text style={s.emptyText}>아직 저장한 맛집이 없어요</Text>
          </View>
        ) : (
          <View style={s.mapArea}>
            <MapMock
              items={items}
              onPinPress={showResult}
              background={require('../../../assets/images/map_mock.png')}
                pinImage={require('../../../assets/images/LocationPin.png')}  // 👈 PNG 사용
            />
          </View>
        )}

        {/* 상세 모달 (⭐ 토글/삭제는 모달 내부에서 처리됨) */}
        <PlaceResultModal
          visible={visible}
          place={selected}
          onClose={closeResult}
          onSave={() => { /* 선택: 토스트 등 후처리 */ }}
          onDelete={() => { /* 선택: 토스트 등 후처리 */ }}
          onNavigate={(p) => { /* TODO: 길안내 */ }}
          onFocusMap={(p) => { /* TODO: 지도 포커스 */ }}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },

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
    lineHeight: 22,
    fontWeight: '700',
    color: TEXT,
  },

  mapArea: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: { fontSize: 13, color: MUTED },
});
