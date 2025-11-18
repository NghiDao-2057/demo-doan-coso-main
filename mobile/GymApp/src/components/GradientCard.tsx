import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../styles/theme';

interface GradientCardProps {
  children: React.ReactNode;
  colors?: string[];
  style?: ViewStyle;
  variant?: 'sakura' | 'sunset' | 'ocean' | 'bamboo' | 'premium' | 'gray';
}

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  colors,
  style,
  variant = 'sakura',
}) => {
  const gradientColors = colors || gradients[variant];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
  },
});
