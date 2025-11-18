// Japanese-inspired color theme matching web design
export const colors = {
  // Primary - Sakura Pink
  sakura: {
    50: '#fef7f7',
    100: '#fce8e8',
    200: '#f8d4d4',
    300: '#f2b5b5',
    400: '#e88989',
    500: '#d95c5c',
    600: '#c73b3b',
    700: '#b02727',
    800: '#8a1f1f',
    900: '#6b1818',
  },
  
  // Zen Gray - Sumi
  sumi: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Gold - Konjiki
  gold: {
    50: '#fffef7',
    100: '#fff9e6',
    200: '#fff3cc',
    300: '#ffe9a3',
    400: '#ffd966',
    500: '#f4b942',
    600: '#d99221',
    700: '#b87514',
    800: '#8f5a0f',
    900: '#6b4410',
  },
  
  // Bamboo Green
  bamboo: {
    50: '#f7fbf7',
    100: '#ecf5ec',
    200: '#d9ead9',
    300: '#b8d8b8',
    400: '#8aba8a',
    500: '#5d995d',
    600: '#3e7a3e',
    700: '#2d5f2d',
    800: '#224922',
    900: '#1a3a1a',
  },
  
  // Ocean Blue
  ocean: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
};

export const gradients = {
  sakura: ['#f2b5b5', '#d95c5c'],
  sunset: ['#ffd966', '#f4b942', '#d99221'],
  ocean: ['#38bdf8', '#0ea5e9', '#0284c7'],
  bamboo: ['#8aba8a', '#5d995d', '#3e7a3e'],
  gray: ['#e0e0e0', '#bdbdbd'],
  premium: ['#ffd966', '#d99221', '#b87514'],
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};
