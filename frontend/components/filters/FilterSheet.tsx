// components/filters/FilterSheet.tsx
import { useState, useMemo } from 'react';
import {
  Modal, View, Text, StyleSheet, Pressable, ScrollView, TouchableWithoutFeedback,
  LayoutChangeEvent, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Chip from '../ui/Chip';

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  /** ✅ 랜덤 추천 버튼 콜백(선택된 필터들을 전달) */
  onRandom?: (filters: Filters) => void;
  initial?: Filters;
};

export type Filters = {
  category: string[];
  priceRange: [number, number];     // 1,000 ~ 100,000 (만원 단위)
  keywords: string[];
  distanceRange: [number, number];  // 100m ~ 10,000m (100m 단위)
  rating: string[];                 // '평점 좋은 순' 포함
};

const ORANGE = '#FB923C';
const ORANGE_DARK = '#C26E22';
const TRACK_GRAY = '#EEE';
const TEXT_GRAY = '#29323A';

const SLIDER_OUTER_PAD = 28; // 슬라이더 좌우 넉넉한 여백
const SCREEN_W = Dimensions.get('window').width;

// Chip 기본 팔레트는 Chip.tsx의 기본값 사용

const CATEGORIES = ['한식', '일식', '양식', '중식', '분식'];
const KEYWORDS = ['혼밥', '평균 10분 안에', '가성비', '데이트 분위기', '늦게까지 영업', '서비스', '카공'];
const RATINGS = ['0+', '1+', '2+', '3+', '4+', '5+', '평점 좋은 순'];

export default function FilterSheet({ visible, onClose, onApply, onRandom, initial }: Props) {
  // 초기: 키워드만 펼침
  const [open, setOpen] = useState({ category: false, price: false, keyword: true, distance: false, rating: false });

  const [filters, setFilters] = useState<Filters>(
    initial ?? { category: [], priceRange: [1000, 100000], keywords: [], distanceRange: [100, 10000], rating: [] }
  );

  const priceChanged = useMemo(
    () => filters.priceRange[0] !== 1000 || filters.priceRange[1] !== 100000,
    [filters.priceRange]
  );
  const distChanged = useMemo(
    () => filters.distanceRange[0] !== 100 || filters.distanceRange[1] !== 10000,
    [filters.distanceRange]
  );

  // 칩 토글(다중)
  const toggleMulti = (type: keyof Filters, value: string) => {
    setFilters(f => {
      const set = new Set(f[type] as string[]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...f, [type]: Array.from(set) };
    });
  };

  const fmtPrice = (v: number) => `${v.toLocaleString()}원`;
  const fmtDist = (m: number) => (m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${m}m`);

  // 슬라이더 길이(반응형): 컨테이너 내부폭(넉넉한 좌우 패딩 제외)으로 계산
  const [sliderWidth, setSliderWidth] = useState<number>(SCREEN_W - SLIDER_OUTER_PAD * 2);
  const onSliderLayout = (e: LayoutChangeEvent) => {
    const outer = Math.min(e.nativeEvent.layout.width, SCREEN_W);
    const inner = Math.max(180, outer - SLIDER_OUTER_PAD * 2);
    setSliderWidth(inner);
  };

  const SectionHeader = ({
    title, badge, isOpen, onToggle,
  }: { title: string; badge?: string; isOpen: boolean; onToggle: () => void }) => (
    <Pressable style={st.sectionHead} onPress={onToggle}>
      <Text style={st.sectionTitle}>{title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {!!badge && <Badge label={badge} />}
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#A0A4AA" />
      </View>
    </Pressable>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={st.backdrop} />
      </TouchableWithoutFeedback>

      <SafeAreaView style={st.sheet} edges={['bottom', 'left', 'right']}>
        {/* 헤더 */}
        <View style={st.header}>
          <Pressable onPress={onClose}><Text style={st.headerAction}>취소</Text></Pressable>
          <Text style={st.headerTitle}>필터</Text>
          <Pressable
            onPress={() =>
              setFilters({ category: [], priceRange: [1000, 100000], keywords: [], distanceRange: [100, 10000], rating: [] })
            }
          >
            <Text style={st.headerAction}>초기화</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          {/* 업종 */}
          <SectionHeader
            title="업종"
            badge={filters.category.length ? String(filters.category.length) : undefined}
            isOpen={open.category}
            onToggle={() => setOpen(o => ({ ...o, category: !o.category }))}
          />
          {open.category && (
            <Row wrap>
              {CATEGORIES.map(c => (
                <Chip
                  key={c}
                  label={c}
                  selected={filters.category.includes(c)}
                  onPress={() => toggleMulti('category', c)}
                />
              ))}
            </Row>
          )}
          <Divider />

          {/* 가격대 */}
          <SectionHeader
            title="가격대"
            badge={priceChanged ? '1' : undefined}
            isOpen={open.price}
            onToggle={() => setOpen(o => ({ ...o, price: !o.price }))}
          />
          {open.price && (
            <View style={st.sliderWrap} onLayout={onSliderLayout}>
              <Text style={st.sliderLabel}>
                {fmtPrice(filters.priceRange[0])} ~ {fmtPrice(filters.priceRange[1])}
              </Text>
              <MultiSlider
                values={[filters.priceRange[0], filters.priceRange[1]]}
                min={1000}
                max={100000}
                step={10000}
                sliderLength={sliderWidth}
                onValuesChangeFinish={(vals) =>
                  setFilters(f => ({ ...f, priceRange: [vals[0], vals[1]] as [number, number] }))
                }
                selectedStyle={{ backgroundColor: ORANGE }}
                unselectedStyle={{ backgroundColor: TRACK_GRAY }}
                markerStyle={{ backgroundColor: ORANGE }}
                pressedMarkerStyle={{ backgroundColor: ORANGE_DARK }}
                allowOverlap={false}
                snapped
              />
              <View style={st.scaleRow}>
                <Text style={st.scaleText}>1천</Text>
                <Text style={st.scaleText}>10만</Text>
              </View>
            </View>
          )}
          <Divider />

          {/* 키워드 */}
          <SectionHeader
            title="키워드"
            badge={filters.keywords.length ? String(filters.keywords.length) : undefined}
            isOpen={open.keyword}
            onToggle={() => setOpen(o => ({ ...o, keyword: !o.keyword }))}
          />
          {open.keyword && (
            <Row wrap>
              {KEYWORDS.map(k => (
                <Chip
                  key={k}
                  label={k}
                  selected={filters.keywords.includes(k)}
                  onPress={() => toggleMulti('keywords', k)}
                />
              ))}
            </Row>
          )}
          <Divider />

          {/* 거리 */}
          <SectionHeader
            title="거리"
            badge={distChanged ? '1' : undefined}
            isOpen={open.distance}
            onToggle={() => setOpen(o => ({ ...o, distance: !o.distance }))}
          />
          {open.distance && (
            <View style={st.sliderWrap} onLayout={onSliderLayout}>
              <Text style={st.sliderLabel}>
                {fmtDist(filters.distanceRange[0])} ~ {fmtDist(filters.distanceRange[1])}
              </Text>
              <MultiSlider
                values={[filters.distanceRange[0], filters.distanceRange[1]]}
                min={100}
                max={10000}
                step={100}
                sliderLength={sliderWidth}
                onValuesChangeFinish={(vals) =>
                  setFilters(f => ({ ...f, distanceRange: [vals[0], vals[1]] as [number, number] }))
                }
                selectedStyle={{ backgroundColor: ORANGE }}
                unselectedStyle={{ backgroundColor: TRACK_GRAY }}
                markerStyle={{ backgroundColor: ORANGE }}
                pressedMarkerStyle={{ backgroundColor: ORANGE_DARK }}
                allowOverlap={false}
                snapped
              />
              <View style={st.scaleRow}>
                <Text style={st.scaleText}>100m</Text>
                <Text style={st.scaleText}>10km</Text>
              </View>
            </View>
          )}
          <Divider />

          {/* 리뷰 평점 */}
          <SectionHeader
            title="리뷰 평점"
            badge={filters.rating.length ? String(filters.rating.length) : undefined}
            isOpen={open.rating}
            onToggle={() => setOpen(o => ({ ...o, rating: !o.rating }))}
          />
          {open.rating && (
            <Row wrap>
              {RATINGS.map(r => (
                <Chip
                  key={r}
                  label={r}
                  selected={filters.rating.includes(r)}
                  onPress={() => toggleMulti('rating', r)}
                />
              ))}
            </Row>
          )}
        </ScrollView>

        {/* 하단 버튼 영역 */}
        <View style={st.actions}>
          {/* ✅ 랜덤 추천 돌리기 (배경 #FFCA9F, 글씨 흰색) */}
          <Pressable
            style={[st.btn, st.btnRandom]}
            onPress={() => onRandom?.(filters)}
            accessibilityLabel="랜덤 추천 돌리기"
          >
            <Text style={[st.btnText, { color: '#FFFFFF' }]}>랜덤 추천 돌리기</Text>
          </Pressable>

          {/* 확인 후 적용 (배경 #FB923C) */}
          <Pressable
            style={[st.btn, st.btnPrimary]}
            onPress={() => { onApply(filters); onClose(); }}
            accessibilityLabel="확인 후 적용"
          >
            <Text style={[st.btnText, { color: '#fff' }]}>확인 후 적용</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function Divider() { return <View style={{ height: 1, backgroundColor: '#EEE', marginVertical: 8 }} />; }
function Badge({ label }: { label: string }) {
  return (
    <View style={{ backgroundColor: ORANGE, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 }}>
      <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '600' }}>{label}</Text>
    </View>
  );
}
function Row({ children, wrap }: { children: React.ReactNode; wrap?: boolean }) {
  return <View style={{ flexDirection: 'row', flexWrap: wrap ? 'wrap' : 'nowrap', paddingHorizontal: 16, gap: 8 }}>{children}</View>;
}

const st = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '88%',
    backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  // ⬇️ 취소/초기화 텍스트 색을 FB923C로
  headerAction: { fontSize: 14, color: '#FB923C', fontWeight: '600' },
  sectionHead: {
    paddingHorizontal: 16, paddingVertical: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  sectionTitle: { fontSize: 15, color: TEXT_GRAY, fontWeight: '700' },
  actions: { padding: 16, gap: 10 }, // 버튼 사이 간격
  btn: { height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: '#FB923C' }, // 확인 후 적용
  btnRandom: { backgroundColor: '#FFCA9F' },   // 랜덤 추천 돌리기
  btnText: { fontSize: 15, fontWeight: '700' },
  // 슬라이더 여백 넉넉히
  sliderWrap: { paddingHorizontal: SLIDER_OUTER_PAD, paddingBottom: 14, paddingTop: 2 },
  sliderLabel: { color: '#4B5563', marginBottom: 8 },
  scaleRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  scaleText: { fontSize: 12, color: '#9CA3AF' },
});
