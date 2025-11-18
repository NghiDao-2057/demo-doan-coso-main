#!/bin/bash

# Script tự động setup React Native project

echo "🚀 Bắt đầu setup React Native project..."

# Kiểm tra Node.js
echo "📦 Kiểm tra Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài đặt. Vui lòng cài đặt Node.js trước."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Cài đặt React Native CLI
echo "🔧 Cài đặt React Native CLI..."
npm install -g @react-native-community/cli

# Tạo dự án React Native
echo "📱 Tạo dự án React Native..."
npx react-native@latest init GymApp

# Di chuyển vào thư mục dự án
cd GymApp

# Cài đặt dependencies
echo "📦 Cài đặt các dependencies..."

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

# Storage
npm install @react-native-async-storage/async-storage

# Form handling
npm install react-hook-form

# Date/Time
npm install react-native-date-picker

# Image picker
npm install react-native-image-picker

echo "✅ Setup hoàn tất!"
echo ""
echo "🎯 Các bước tiếp theo:"
echo "1. cd GymApp"
echo "2. npx react-native start"
echo "3. npx react-native run-android (terminal khác)"
echo ""
echo "📚 Đọc README.md để biết thêm chi tiết!"