// components/overlays/PlaceResultModal.tsx
import * as React from 'react';
import {
  Modal, View, Text, StyleSheet, Pressable, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSavedPlaces } from '../../hooks/useSavedPlace';
import type { Place } from '../types/place';

const ORANGE = '#FB923C';
const TEXT = '#29323A';
const MUTED = '#6B7280';
const DIVIDER = '#EEE';
const CARD_BG = '#FFFFFF';
const HERO_BG = '#EEC9A9';

type Props = {
  visible: boolean;
  place: Place | null;
  onClose: () => void;
  onSave?: (p: Place) => void;
  onDelete?: (p: Place) => void;
  onNavigate?: (p: Place) => void;
  onFocusMap?: (p: Place) => void;
};

function Stars({ rating = 0, count = 0 }: { rating?: number; count?: number }) {
  if (!rating && !count) return null;
  const full = Math.floor(rating ?? 0);
  const half = (rating ?? 0) - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <View style={s.starsRow}>
      {Array.from({ length: full }).map((_, i) => (
        <Ionicons key={`f${i}`} name="star" size={14} color={ORANGE} />
      ))}
      {half && <Ionicons name="star-half" size={14} color={ORANGE} />}
      {Array.from({ length: empty }).map((_, i) => (
        <Ionicons key={`e${i}`} name="star-outline" size={14} color={ORANGE} />
      ))}
      {!!count && <Text style={s.starCount}>({count})</Text>}
    </View>
  );
}

function InfoRow({
  icon, text, mutedFallback, multiline,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  mutedFallback?: boolean;
  multiline?: boolean;
}) {
  return (
    <View style={s.infoRow}>
      <Ionicons name={icon} size={16} color={MUTED} style={{ marginTop: multiline ? 2 : 0 }} />
      <Text
        style={[
          s.infoText,
          mutedFallback ? { color: MUTED } : null,
          multiline ? { flexShrink: 1 } : null,
        ]}
        numberOfLines={multiline ? 0 : 2}
      >
        {text}
      </Text>
    </View>
  );
}

export function PlaceResultModal({
  visible,
  place,
  onClose,
  onSave,
  onDelete,
  onNavigate,
  onFocusMap,
}: Props) {
  const toggle = useSavedPlaces((s) => s.toggle);

  // items를 직접 구독해서 저장 여부를 계산 → 토글 직후 별 아이콘이 즉시 반영
  const saved = useSavedPlaces(
    React.useCallback(
      (s) => (place ? s.items.some((x) => x.id === place.id) : false),
      [place?.id],
    ),
  );

  if (!place) return null;

  const ratingAvg = (place as any)?.ratingAvg as number | undefined;
  const ratingCount = (place as any)?.ratingCount as number | undefined;

  const handleToggle = () => {
    toggle(place);
    if (!saved) onSave?.(place);
    else onDelete?.(place);
  };

  const hasAnyDetail =
    !!place.distanceM ||
    !!place.openTimeText ||
    !!place.address ||
    !!place.desc ||
    !!ratingAvg ||
    !!ratingCount;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.modalRoot} pointerEvents="box-none">
        {/* 바깥 영역 탭 시 닫힘 */}
        <Pressable style={s.backdrop} onPress={onClose} />

        <View style={s.sheet} pointerEvents="auto">
          {/* 헤더 */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              <Pressable onPress={handleToggle} hitSlop={8} style={s.starBtn}>
                <Ionicons
                  name={saved ? 'star' : 'star-outline'}
                  size={20}
                  color={saved ? ORANGE : '#C9CDD2'}
                />
              </Pressable>
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text style={s.title} numberOfLines={1}>{place.name}</Text>
                <Text style={s.category} numberOfLines={1}>{place.category}</Text>
              </View>
            </View>

            <Pressable hitSlop={8}>
              <Ionicons name="ellipsis-vertical" size={18} color={MUTED} />
            </Pressable>
          </View>

          {/* 대표 이미지 */}
          <View style={s.hero}>
            {place.imageUrl ? (
              <Image source={{ uri: place.imageUrl }} style={s.heroImg} resizeMode="cover" />
            ) : (
              <View style={s.heroDummy} />
            )}
          </View>

          {/* 본문 정보 */}
          <View style={s.body}>
            {place.distanceM || place.openTimeText ? (
              <InfoRow
                icon="time-outline"
                text={[
                  place.distanceM ? `${place.distanceM}m` : null,
                  place.openTimeText ?? null,
                ].filter(Boolean).join('  ·  ')}
              />
            ) : (
              <InfoRow icon="time-outline" text="영업시간 정보가 없어요" mutedFallback />
            )}

            <InfoRow
              icon="location-outline"
              text={place.address || '주소 정보가 없어요'}
              mutedFallback={!place.address}
            />

            <InfoRow
              icon="document-text-outline"
              text={place.desc || '설명이 아직 없어요'}
              mutedFallback={!place.desc}
              multiline
            />

            {(!!ratingAvg || !!ratingCount) && (
              <View style={s.ratingWrap}>
                <Stars rating={ratingAvg} count={ratingCount} />
              </View>
            )}

            {!hasAnyDetail && (
              <Text style={s.noDetail}>상세 정보가 아직 없습니다.</Text>
            )}
          </View>

          {/* 액션 */}
          <View style={s.actions}>
            <Pressable
              onPress={handleToggle}
              style={({ pressed }) => [s.secondaryBtn, pressed && s.pressed]}
            >
              <Text style={s.secondaryText}>{saved ? '삭제' : '저장하기'}</Text>
            </Pressable>

            <Pressable
              onPress={() => onNavigate?.(place)}
              style={({ pressed }) => [s.primaryBtn, pressed && s.pressed]}
            >
              <Text style={s.primaryText}>길 안내</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  modalRoot: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)', zIndex: 1 },
  sheet: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: CARD_BG,
    zIndex: 2,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: DIVIDER,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  starBtn: { padding: 4 },
  title: { fontSize: 16, fontWeight: '700', color: TEXT },
  category: { fontSize: 12, color: MUTED, marginTop: 2 },
  hero: { width: '100%', aspectRatio: 16 / 9, backgroundColor: HERO_BG },
  heroImg: { width: '100%', height: '100%' },
  heroDummy: { flex: 1 },
  body: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8, gap: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  infoText: { fontSize: 13, color: TEXT, flexShrink: 1 },
  ratingWrap: { marginTop: 4 },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  starCount: { fontSize: 12, color: MUTED, marginLeft: 4 },
  noDetail: { fontSize: 12, color: MUTED, marginTop: 2 },
  actions: {
    paddingHorizontal: 14, paddingVertical: 12,
    flexDirection: 'row', justifyContent: 'flex-end', gap: 10,
  },
  primaryBtn: {
    height: 40, paddingHorizontal: 16, borderRadius: 20,
    backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: {
    height: 40, paddingHorizontal: 14, borderRadius: 20,
    backgroundColor: '#F6F7F9', borderWidth: 1, borderColor: DIVIDER,
    alignItems: 'center', justifyContent: 'center',
  },
  secondaryText: { color: TEXT, fontWeight: '700' },
  pressed: { opacity: 0.9 },
});
