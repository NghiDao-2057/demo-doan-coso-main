@echo off
REM Thiết lập biến môi trường cho Android Development

echo 🔧 Thiết lập biến môi trường Android...

REM Đường dẫn Android SDK (thay đổi theo đường dẫn cài đặt của bạn)
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%

REM Thêm vào PATH
set PATH=%PATH%;%ANDROID_HOME%\emulator
set PATH=%PATH%;%ANDROID_HOME%\platform-tools
set PATH=%PATH%;%ANDROID_HOME%\cmdline-tools\latest\bin

echo ✅ ANDROID_HOME: %ANDROID_HOME%
echo ✅ PATH đã được cập nhật

REM Kiểm tra ADB
echo 📱 Kiểm tra ADB...
adb version

REM Kiểm tra Emulator
echo 📱 Kiểm tra Emulator...
emulator -version

REM Liệt kê máy ảo có sẵn
echo 📱 Danh sách máy ảo:
emulator -list-avds

echo.
echo 🎯 Để chạy máy ảo, sử dụng lệnh:
echo emulator -avd [TEN_MAY_AO]
echo.
echo 📚 Ví dụ:
echo emulator -avd Pixel_6_API_33

pause