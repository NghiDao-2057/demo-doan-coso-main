import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import apiService from '../services/api';

const QRScannerScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [processing, setProcessing] = useState(false);

  // Simulate QR scanning with manual input for now
  // In production, use react-native-camera or expo-barcode-scanner
  const handleManualInput = () => {
    Alert.prompt(
      'Nhập mã QR',
      'Nhập mã check-in hoặc scan QR code',
      async (qrCode) => {
        if (qrCode) {
          await processQRCode(qrCode);
        }
      },
      'plain-text'
    );
  };

  const processQRCode = async (qrCode: string) => {
    try {
      setProcessing(true);

      // Parse QR code format: "CLASS:{classId}:{timestamp}"
      const parts = qrCode.split(':');
      
      if (parts.length < 2 || parts[0] !== 'CLASS') {
        Alert.alert('Lỗi', 'Mã QR không hợp lệ');
        return;
      }

      const classId = parts[1];
      const userId = (user as any)?._id || (user as any)?.id;

      // Call check-in API
      const response = await apiService.post('/attendance/qr-checkin', {
        userId,
        classId,
        qrCode,
      });

      Alert.alert(
        'Thành công! ✓',
        `Điểm danh thành công!\n\nLớp: ${(response as any).className || 'N/A'}\nThời gian: ${new Date().toLocaleString('vi-VN')}`,
        [
          {
            text: 'Xem lịch sử',
            onPress: () => navigation.navigate('History'),
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    } catch (error: any) {
      console.error('QR check-in error:', error);
      Alert.alert(
        'Lỗi điểm danh',
        error.message || 'Không thể điểm danh. Vui lòng thử lại.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const openCameraSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Check-in</Text>
      </View>

      <View style={styles.content}>
        {/* QR Scanner Frame */}
        <View style={styles.scannerContainer}>
          <View style={styles.scannerFrame}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
            
            <View style={styles.scannerCenter}>
              <Text style={styles.scannerIcon}>📷</Text>
              <Text style={styles.scannerText}>
                Đưa mã QR vào khung để check-in
              </Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>📋 Hướng dẫn:</Text>
          <Text style={styles.instructionItem}>
            1. Tìm mã QR tại quầy lễ tân hoặc trong phòng tập
          </Text>
          <Text style={styles.instructionItem}>
            2. Đưa camera vào khung quét phía trên
          </Text>
          <Text style={styles.instructionItem}>
            3. Hệ thống sẽ tự động điểm danh cho bạn
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.manualButton}
            onPress={handleManualInput}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.manualButtonIcon}>⌨️</Text>
                <Text style={styles.manualButtonText}>Nhập mã thủ công</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={openCameraSettings}
          >
            <Text style={styles.settingsButtonText}>⚙️ Cài đặt camera</Text>
          </TouchableOpacity>
        </View>

        {/* Demo QR Codes */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>🔧 Demo - Mã QR test:</Text>
          <View style={styles.demoCodesContainer}>
            <TouchableOpacity
              style={styles.demoCodeButton}
              onPress={() => processQRCode('CLASS:673706f85c06ee81b40cfcb7:' + Date.now())}
            >
              <Text style={styles.demoCodeText}>Lớp 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.demoCodeButton}
              onPress={() => processQRCode('CLASS:673706f85c06ee81b40cfcb8:' + Date.now())}
            >
              <Text style={styles.demoCodeText}>Lớp 2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.demoCodeButton}
              onPress={() => processQRCode('CLASS:673706f85c06ee81b40cfcb9:' + Date.now())}
            >
              <Text style={styles.demoCodeText}>Lớp 3</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.demoNote}>
            * Chỉ dùng để test. QR thật sẽ được tạo bởi admin
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1a1a1a',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scannerContainer: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },
  scannerFrame: {
    width: 280,
    height: 280,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#4CAF50',
  },
  cornerTopLeft: {
    top: 10,
    left: 10,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 10,
    right: 10,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scannerCenter: {
    alignItems: 'center',
  },
  scannerIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  scannerText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  instructionsContainer: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
  },
  instructionItem: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
    lineHeight: 20,
  },
  actionButtons: {
    marginBottom: 20,
  },
  manualButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  manualButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  manualButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
  demoContainer: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 12,
  },
  demoCodesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  demoCodeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  demoCodeText: {
    color: '#FF9800',
    fontSize: 12,
    fontWeight: '600',
  },
  demoNote: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default QRScannerScreen;
