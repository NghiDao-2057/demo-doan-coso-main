@echo off
REM Script tự động setup React Native project cho Windows

echo 🚀 Bắt đầu setup React Native project...

REM Kiểm tra Node.js
echo 📦 Kiểm tra Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js chưa được cài đặt. Vui lòng cài đặt Node.js trước.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version

REM Cài đặt React Native CLI
echo 🔧 Cài đặt React Native CLI...
npm install -g @react-native-community/cli

REM Tạo dự án React Native
echo 📱 Tạo dự án React Native...
npx react-native@latest init GymApp

REM Di chuyển vào thư mục dự án
cd GymApp

REM Cài đặt dependencies
echo 📦 Cài đặt các dependencies...

REM Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

REM State management
npm install @reduxjs/toolkit react-redux

REM HTTP client
npm install axios

REM UI components
npm install react-native-elements react-native-vector-icons
npm install react-native-paper

REM Storage
npm install @react-native-async-storage/async-storage

REM Form handling
npm install react-hook-form

REM Date/Time
npm install react-native-date-picker

REM Image picker
npm install react-native-image-picker

echo ✅ Setup hoàn tất!
echo.
echo 🎯 Các bước tiếp theo:
echo 1. cd GymApp
echo 2. npx react-native start
echo 3. npx react-native run-android (terminal khác)
echo.
echo 📚 Đọc README.md để biết thêm chi tiết!
pause