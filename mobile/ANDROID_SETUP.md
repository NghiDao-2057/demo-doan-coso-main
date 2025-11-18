# Hướng dẫn chạy máy ảo Android cho React Native

## 🚀 Bước 1: Cài đặt môi trường

### 1.1 Cài đặt Android Studio
- Tải từ: https://developer.android.com/studio
- Cài đặt với cấu hình mặc định
- Mở Android Studio lần đầu để tải SDK

### 1.2 Cài đặt Android SDK
```
Android Studio → More Actions → SDK Manager
Hoặc: Tools → SDK Manager (nếu đã mở project)

SDK Platforms tab:
☑️ Android 13.0 (API level 33)
☑️ Android 12.0 (API level 31)

SDK Tools tab:
☑️ Android SDK Build-Tools
☑️ Android Emulator
☑️ Android SDK Platform-Tools
☑️ Android SDK Command-line Tools
```

## 📱 Bước 2: Tạo máy ảo (AVD)

### 2.1 Mở AVD Manager
```
Android Studio → More Actions → AVD Manager
Hoặc: Tools → AVD Manager
```

### 2.2 Tạo Virtual Device
```
1. Click "Create Virtual Device"
2. Chọn Category: Phone
3. Chọn Device: Pixel 6 hoặc Pixel 7
4. Click "Next"
5. Chọn System Image: API 33 (Android 13)
6. Click "Download" nếu chưa có
7. Click "Next" → "Finish"
```

### 2.3 Cấu hình AVD (tùy chọn)
```
- RAM: 2048 MB trở lên
- VM Heap: 512 MB
- Internal Storage: 6 GB
- SD Card: 512 MB
```

## 🔧 Bước 3: Thiết lập biến môi trường

### 3.1 Chạy script tự động
```cmd
cd mobile
.\setup-android.bat
```

### 3.2 Hoặc thiết lập thủ công
```cmd
# Mở System Properties → Advanced → Environment Variables
# Thêm biến mới:

ANDROID_HOME=C:\Users\[USERNAME]\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT=%ANDROID_HOME%

# Thêm vào PATH:
%ANDROID_HOME%\emulator
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\cmdline-tools\latest\bin
```

## 🚀 Bước 4: Chạy máy ảo

### 4.1 Kiểm tra máy ảo có sẵn
```cmd
emulator -list-avds
```

### 4.2 Chạy máy ảo
```cmd
# Cách 1: Từ Android Studio
AVD Manager → Click nút ▶️ bên cạnh máy ảo

# Cách 2: Từ Command Line
emulator -avd Pixel_6_API_33

# Cách 3: Chạy trong nền
emulator -avd Pixel_6_API_33 &
```

### 4.3 Kiểm tra kết nối
```cmd
adb devices
```
Kết quả mong đợi:
```
List of devices attached
emulator-5554   device
```

## 📱 Bước 5: Chạy React Native App

### 5.1 Khởi động Metro Bundler
```cmd
cd mobile/GymApp
npx react-native start
```

### 5.2 Chạy trên Android (Terminal mới)
```cmd
npx react-native run-android
```

## 🔍 Troubleshooting

### Lỗi thường gặp:

#### 1. "emulator: command not found"
```cmd
# Kiểm tra PATH
echo %PATH%

# Chạy trực tiếp
C:\Users\%USERNAME%\AppData\Local\Android\Sdk\emulator\emulator -avd [TEN_MAY_AO]
```

#### 2. "No devices found"
```cmd
# Khởi động lại ADB
adb kill-server
adb start-server

# Kiểm tra lại
adb devices
```

#### 3. "SDK location not found"
```cmd
# Tạo local.properties trong android/
echo sdk.dir=C:\\Users\\%USERNAME%\\AppData\\Local\\Android\\Sdk > android\local.properties
```

#### 4. Máy ảo chạy chậm
- Bật Hardware Acceleration (Intel HAXM/AMD)
- Tăng RAM cho AVD
- Sử dụng x86_64 images thay vì ARM

## 💡 Tips

### 1. Sử dụng máy thật thay vì máy ảo
```cmd
# Bật Developer Options trên điện thoại
# Bật USB Debugging
# Kết nối USB và chạy:
adb devices
npx react-native run-android
```

### 2. Hot Reload
```
Shake device → Enable Hot Reloading
Hoặc: Ctrl+M (emulator) → Enable Hot Reloading
```

### 3. Debug Menu
```
Ctrl+M (emulator)
Cmd+M (iOS simulator)  
Shake device (physical)
```

### 4. Logs
```cmd
# Android logs
npx react-native log-android

# Hoặc
adb logcat *:S ReactNative:V ReactNativeJS:V
```