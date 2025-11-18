# React Native Mobile App

## Hướng dẫn cài đặt và chạy ứng dụng React Native

### 1. Cài đặt môi trường

#### Cài đặt Node.js và npm
```bash
# Kiểm tra Node.js đã cài đặt
node --version
npm --version
```

#### Cài đặt React Native CLI
```bash
npm install -g @react-native-community/cli
```

#### Cài đặt Java Development Kit (JDK) 17
- Tải và cài đặt JDK 17 từ Oracle hoặc OpenJDK
- Thiết lập biến môi trường JAVA_HOME

#### Cài đặt Android Studio
- Tải và cài đặt Android Studio
- Cài đặt Android SDK (API Level 33 trở lên)
- Thiết lập biến môi trường ANDROID_HOME

### 2. Tạo dự án React Native

```bash
# Di chuyển vào thư mục mobile
cd mobile

# Tạo dự án React Native mới
npx react-native@latest init GymApp

# Di chuyển vào thư mục dự án
cd GymApp
```

### 3. Cài đặt các dependencies cần thiết

```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# State management
npm install @reduxjs/toolkit react-redux

# HTTP client
npm install axios

# UI components
npm install react-native-elements react-native-vector-icons
npm install react-native-paper

# Date/Time
npm install react-native-date-picker

# Image picker
npm install react-native-image-picker

# Storage
npm install @react-native-async-storage/async-storage

# Form handling
npm install react-hook-form

# Camera/QR Code
npm install react-native-qrcode-scanner
npm install react-native-camera

# Push notifications
npm install @react-native-firebase/app @react-native-firebase/messaging

# Maps (nếu cần)
npm install react-native-maps
```

### 4. Cài đặt cho iOS (nếu phát triển trên macOS)

```bash
cd ios
pod install
cd ..
```

### 5. Chạy ứng dụng

#### Android
```bash
# Khởi động Metro bundler
npx react-native start

# Chạy trên Android (terminal khác)
npx react-native run-android
```

#### iOS (chỉ trên macOS)
```bash
npx react-native run-ios
```

### 6. Cấu trúc thư mục đề xuất

```
src/
  components/
    common/
    auth/
    classes/
    membership/
    payment/
  screens/
    auth/
    home/
    classes/
    profile/
    payment/
  navigation/
  services/
    api/
    storage/
  utils/
  constants/
  hooks/
  store/
    slices/
```

### 7. Cấu hình API

Tạo file `src/constants/config.js`:
```javascript
export const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Android Emulator
// export const API_BASE_URL = 'http://localhost:5000/api'; // iOS Simulator
```

### 8. Debugging

```bash
# Mở React Native Debugger
npx react-native log-android  # Android logs
npx react-native log-ios      # iOS logs
```

### 9. Build for production

#### Android
```bash
cd android
./gradlew assembleRelease
```

#### iOS
- Mở project trong Xcode
- Archive và export