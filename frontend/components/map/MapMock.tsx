// components/map/MapMock.tsx
import { ImageBackground, StyleSheet, View, Pressable, Image, ImageSourcePropType } from 'react-native';
import { useMemo } from 'react';
import type { Place } from '../types/place';

export type MockItem = {
  place: Place;
  x: number; // 0~1
  y: number; // 0~1
};

type Props = {
  items: MockItem[];
  onPinPress: (p: Place) => void;
  background: any; // require(...)
  pinImage: ImageSourcePropType; // ✅ PNG 핀
  pinSize?: number;              // ✅ 기본값 20 (줄여놓음)
  anchor?: { x: number; y: number }; // ✅ 좌표 찍힐 기준점
};

const DEFAULT_PIN_SIZE = 20; // 👈 기존 28 → 20으로 줄임

export default function MapMock({
  items,
  onPinPress,
  background,
  pinImage,
  pinSize = DEFAULT_PIN_SIZE,
  anchor = { x: 0.5, y: 1 },
}: Props) {
  const pins = useMemo(
    () => items.map(({ place, x, y }) => ({ id: String(place.id), x, y, place })),
    [items]
  );

  return (
    <View style={st.wrap}>
      {/* 지도 배경 */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <ImageBackground source={background} resizeMode="cover" style={StyleSheet.absoluteFillObject} />
      </View>

      {/* 핀 */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        {pins.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => onPinPress(p.place)}
            style={[
              st.pin,
              {
                left: `${p.x * 100}%`,
                top: `${p.y * 100}%`,
                transform: [
                  { translateX: -pinSize * anchor.x },
                  { translateY: -pinSize * anchor.y },
                ],
              } as const,
            ]}
            hitSlop={8}
          >
            <Image
              source={pinImage}
              style={{ width: pinSize, height: pinSize }}
              resizeMode="contain"
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { flex: 1, position: 'relative', overflow: 'hidden', width: '100%', height: '100%' },
  pin: { position: 'absolute' },
});
