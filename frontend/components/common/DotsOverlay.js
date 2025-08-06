// components/common/DotsOverlay.js
import React from "react";
import { Dimensions } from "react-native";
import Svg, { Circle } from "react-native-svg";

const { height } = Dimensions.get("window");

export default function DotsOverlay() {
  const dots = [];
  for (let y = 0; y < height; y += 28) {
    for (let x = 0; x < 420; x += 28) {
      dots.push(
        <Circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={3}
          fill="rgba(255,255,255,0.5)"
        />
      );
    }
  }

  return (
    <Svg
      height={height}
      width="420"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {dots}
    </Svg>
  );
}
