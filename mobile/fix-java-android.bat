@echo off
REM Script thiết lập JAVA_HOME và Android environment

echo 🔧 Thiết lập JAVA_HOME và Android environment...

REM Tìm Java installation
echo 📋 Tìm Java installation...

REM Kiểm tra các đường dẫn Java phổ biến
set JAVA_PATH_1=C:\Program Files\Java\jdk-17
set JAVA_PATH_2=C:\Program Files\Java\jdk-11
set JAVA_PATH_3=C:\Program Files\OpenJDK\jdk-17
set JAVA_PATH_4=C:\Program Files\Eclipse Adoptium\jdk-17.0.9.9-hotspot
set JAVA_PATH_5=C:\Program Files\Eclipse Adoptium\jdk-11.0.21.9-hotspot

if exist "%JAVA_PATH_1%" (
    set JAVA_HOME=%JAVA_PATH_1%
    echo ✅ Tìm thấy Java tại: %JAVA_HOME%
) else if exist "%JAVA_PATH_2%" (
    set JAVA_HOME=%JAVA_PATH_2%
    echo ✅ Tìm thấy Java tại: %JAVA_HOME%
) else if exist "%JAVA_PATH_3%" (
    set JAVA_HOME=%JAVA_PATH_3%
    echo ✅ Tìm thấy Java tại: %JAVA_HOME%
) else if exist "%JAVA_PATH_4%" (
    set JAVA_HOME=%JAVA_PATH_4%
    echo ✅ Tìm thấy Java tại: %JAVA_HOME%
) else if exist "%JAVA_PATH_5%" (
    set JAVA_HOME=%JAVA_PATH_5%
    echo ✅ Tìm thấy Java tại: %JAVA_HOME%
) else (
    echo ❌ Không tìm thấy Java JDK!
    echo 📥 Vui lòng tải và cài đặt JDK 17 từ:
    echo https://adoptium.net/
    pause
    exit /b 1
)

REM Thiết lập Android SDK
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%

REM Cập nhật PATH cho session hiện tại
set PATH=%JAVA_HOME%\bin;%PATH%
set PATH=%ANDROID_HOME%\emulator;%PATH%
set PATH=%ANDROID_HOME%\platform-tools;%PATH%
set PATH=%ANDROID_HOME%\cmdline-tools\latest\bin;%PATH%

echo.
echo ✅ Biến môi trường đã được thiết lập:
echo JAVA_HOME: %JAVA_HOME%
echo ANDROID_HOME: %ANDROID_HOME%

echo.
echo 🧪 Kiểm tra Java...
java -version

echo.
echo 🧪 Kiểm tra Android ADB... 
adb version

echo.
echo 🧪 Kiểm tra devices...
adb devices

echo.
echo 🚀 Thiết lập hoàn tất! Bây giờ bạn có thể chạy:
echo npx react-native run-android

echo.
echo ⚠️  LƯU Ý: Để thiết lập vĩnh viễn, hãy:
echo 1. Mở System Properties ^> Advanced ^> Environment Variables
echo 2. Thêm JAVA_HOME = %JAVA_HOME%
echo 3. Thêm ANDROID_HOME = %ANDROID_HOME%
echo 4. Thêm vào PATH: %%JAVA_HOME%%\bin;%%ANDROID_HOME%%\platform-tools

pause