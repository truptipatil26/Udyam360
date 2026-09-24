import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../constants/theme";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export default function ScoreGauge({
  score,
  size = 116,
  strokeWidth = 11,
  label,
}: ScoreGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score));

  const getColor = () => {
    if (clamped >= 75) return colors.success;
    if (clamped >= 50) return colors.accent;
    return colors.danger;
  };

  const percentage = `${clamped}%`;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: colors.surfaceAlt,
        },
      ]}
    >
      <View
        style={[
          styles.progress,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: getColor(),
            borderRightColor: "transparent",
            borderBottomColor:
              clamped >= 50 ? getColor() : "transparent",
            transform: [{ rotate: "-45deg" }],
            position: "absolute",
          },
        ]}
      />

      <View style={styles.center}>
        <Text style={styles.scoreText}>{clamped}</Text>

        {label ? (
          <Text style={styles.labelText}>{label}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  progress: {
    top: 0,
    left: 0,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  scoreText: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  labelText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 2,
  },
});