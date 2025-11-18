@echo off
echo 🔧 Khắc phục lỗi Android SDK...

REM Thiết lập Android SDK path
set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%

echo ✅ ANDROID_HOME: %ANDROID_HOME%

REM Tạo local.properties file
echo 📝 Tạo local.properties...
echo sdk.dir=%ANDROID_HOME:\=/% > android\local.properties

echo ✅ Đã tạo android\local.properties

REM Kiểm tra file local.properties
echo 📋 Nội dung local.properties:
type android\local.properties

REM Kiểm tra ADB
echo 🧪 Kiểm tra ADB...
"%ANDROID_HOME%\platform-tools\adb.exe" devices

echo.
echo ✅ Khắc phục hoàn tất! Bây giờ chạy lại:
echo npx react-native run-android

pause