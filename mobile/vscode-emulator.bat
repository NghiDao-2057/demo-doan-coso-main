@echo off
REM Script quản lý Android Emulator từ VS Code

echo 🤖 Android Emulator Manager cho VS Code

REM Thiết lập Android paths
set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
set EMULATOR_PATH=%ANDROID_HOME%\emulator
set ADB_PATH=%ANDROID_HOME%\platform-tools

echo 📱 Liệt kê các AVD có sẵn:
echo.
"%EMULATOR_PATH%\emulator" -list-avds
echo.

set /p AVD_NAME="Nhập tên AVD muốn chạy (hoặc Enter để chạy default): "

if "%AVD_NAME%"=="" (
    echo 🚀 Chạy emulator mặc định...
    start /B "%EMULATOR_PATH%\emulator" -avd Pixel_6_API_33
) else (
    echo 🚀 Chạy emulator: %AVD_NAME%
    start /B "%EMULATOR_PATH%\emulator" -avd %AVD_NAME%
)

echo.
echo ⏰ Đang khởi động emulator...
echo 💡 Tip: Đợi 30-60 giây để emulator boot xong

REM Đợi emulator khởi động
timeout /t 5 /nobreak >nul

echo.
echo 🔍 Kiểm tra devices:
"%ADB_PATH%\adb" devices

echo.
echo ✅ Emulator đang chạy! Bây giờ bạn có thể:
echo 1. Chạy React Native: npx react-native run-android
echo 2. Sử dụng VS Code extensions để debug
echo 3. Dùng Ctrl+Shift+P trong VS Code > "Emulate"

pause