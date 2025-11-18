import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Clipboard,
} from 'react-native';
import apiService from '../services/api';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemType: 'class' | 'membership';
  itemId: string;
  itemName: string;
  amount: number;
  userId: string;
}

const BANK_INFO = {
  bankName: 'Vietcombank',
  accountNumber: '1234567890',
  accountName: 'NGUYEN VAN A',
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  onSuccess,
  itemType,
  itemId,
  itemName,
  amount,
  userId,
}) => {
  const [step, setStep] = useState(1); // 1: Chọn phương thức, 2: Thông tin chuyển khoản
  const [processing, setProcessing] = useState(false);

  const handleSelectMethod = (method: 'bank' | 'cash') => {
    if (method === 'cash') {
      // Thanh toán tiền mặt - tạo payment ngay
      handleCashPayment();
    } else {
      // Chuyển khoản - hiển thị thông tin
      setStep(2);
    }
  };

  const handleCashPayment = async () => {
    try {
      setProcessing(true);
      
      const paymentData = {
        userId,
        amount,
        method: 'cash',
        status: 'pending',
        description: `Thanh toán ${itemType === 'class' ? 'lớp học' : 'thẻ thành viên'}: ${itemName}`,
        ...(itemType === 'class' && { classId: itemId }),
        ...(itemType === 'membership' && { membershipId: itemId }),
      };

      await apiService.post('/payments', paymentData);
      
      Alert.alert(
        'Thành công',
        'Đơn hàng của bạn đã được tạo. Vui lòng thanh toán tiền mặt tại quầy trong vòng 24h.',
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess();
              resetModal();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể tạo đơn hàng');
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmBankTransfer = async () => {
    try {
      setProcessing(true);
      
      const paymentData = {
        userId,
        amount,
        method: 'bank',
        status: 'pending',
        description: `Thanh toán ${itemType === 'class' ? 'lớp học' : 'thẻ thành viên'}: ${itemName}`,
        ...(itemType === 'class' && { classId: itemId }),
        ...(itemType === 'membership' && { membershipId: itemId }),
      };

      await apiService.post('/payments', paymentData);
      
      Alert.alert(
        'Thành công',
        'Đơn hàng đã được tạo. Vui lòng chuyển khoản theo thông tin đã cung cấp. Đơn hàng sẽ được xử lý sau khi xác nhận.',
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess();
              resetModal();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể tạo đơn hàng');
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert('Đã sao chép', `${label} đã được sao chép vào clipboard`);
  };

  const resetModal = () => {
    setStep(1);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {step === 1 && 'Chọn phương thức thanh toán'}
              {step === 2 && 'Thông tin chuyển khoản'}
            </Text>
            <TouchableOpacity onPress={resetModal} disabled={processing}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {/* Step 1: Chọn phương thức */}
            {step === 1 && (
              <View>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderInfoTitle}>Thông tin đơn hàng</Text>
                  <View style={styles.orderInfoRow}>
                    <Text style={styles.orderInfoLabel}>
                      {itemType === 'class' ? 'Lớp học:' : 'Thẻ thành viên:'}
                    </Text>
                    <Text style={styles.orderInfoValue}>{itemName}</Text>
                  </View>
                  <View style={styles.orderInfoRow}>
                    <Text style={styles.orderInfoLabel}>Tổng tiền:</Text>
                    <Text style={styles.orderInfoTotal}>
                      {amount.toLocaleString('vi-VN')}đ
                    </Text>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Chọn phương thức thanh toán</Text>

                <TouchableOpacity
                  style={styles.methodCard}
                  onPress={() => handleSelectMethod('bank')}
                  disabled={processing}
                >
                  <View style={styles.methodIcon}>
                    <Text style={styles.methodIconText}>🏦</Text>
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>Chuyển khoản ngân hàng</Text>
                    <Text style={styles.methodDesc}>
                      Chuyển khoản qua Vietcombank
                    </Text>
                  </View>
                  <Text style={styles.methodArrow}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.methodCard}
                  onPress={() => handleSelectMethod('cash')}
                  disabled={processing}
                >
                  <View style={styles.methodIcon}>
                    <Text style={styles.methodIconText}>💵</Text>
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodName}>Thanh toán tiền mặt</Text>
                    <Text style={styles.methodDesc}>
                      Thanh toán trực tiếp tại quầy
                    </Text>
                  </View>
                  <Text style={styles.methodArrow}>→</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Thông tin chuyển khoản */}
            {step === 2 && (
              <View>
                <View style={styles.bankInfoCard}>
                  <Text style={styles.bankInfoTitle}>Thông tin chuyển khoản</Text>
                  
                  <View style={styles.bankInfoItem}>
                    <Text style={styles.bankInfoLabel}>Ngân hàng:</Text>
                    <View style={styles.bankInfoValueContainer}>
                      <Text style={styles.bankInfoValue}>{BANK_INFO.bankName}</Text>
                      <TouchableOpacity
                        onPress={() => copyToClipboard(BANK_INFO.bankName, 'Tên ngân hàng')}
                      >
                        <Text style={styles.copyIcon}>📋</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.bankInfoItem}>
                    <Text style={styles.bankInfoLabel}>Số tài khoản:</Text>
                    <View style={styles.bankInfoValueContainer}>
                      <Text style={styles.bankInfoValue}>{BANK_INFO.accountNumber}</Text>
                      <TouchableOpacity
                        onPress={() => copyToClipboard(BANK_INFO.accountNumber, 'Số tài khoản')}
                      >
                        <Text style={styles.copyIcon}>📋</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.bankInfoItem}>
                    <Text style={styles.bankInfoLabel}>Chủ tài khoản:</Text>
                    <View style={styles.bankInfoValueContainer}>
                      <Text style={styles.bankInfoValue}>{BANK_INFO.accountName}</Text>
                      <TouchableOpacity
                        onPress={() => copyToClipboard(BANK_INFO.accountName, 'Chủ tài khoản')}
                      >
                        <Text style={styles.copyIcon}>📋</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.bankInfoItem}>
                    <Text style={styles.bankInfoLabel}>Số tiền:</Text>
                    <View style={styles.bankInfoValueContainer}>
                      <Text style={[styles.bankInfoValue, styles.amountText]}>
                        {amount.toLocaleString('vi-VN')}đ
                      </Text>
                      <TouchableOpacity
                        onPress={() => copyToClipboard(amount.toString(), 'Số tiền')}
                      >
                        <Text style={styles.copyIcon}>📋</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.bankInfoItem}>
                    <Text style={styles.bankInfoLabel}>Nội dung:</Text>
                    <View style={styles.bankInfoValueContainer}>
                      <Text style={styles.bankInfoValue}>
                        {itemType === 'class' ? `LOPHOC ${itemId}` : `THANHVIEN ${itemId}`}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          copyToClipboard(
                            itemType === 'class' ? `LOPHOC ${itemId}` : `THANHVIEN ${itemId}`,
                            'Nội dung'
                          )
                        }
                      >
                        <Text style={styles.copyIcon}>📋</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.noteCard}>
                  <Text style={styles.noteTitle}>⚠️ Lưu ý quan trọng</Text>
                  <Text style={styles.noteText}>
                    • Vui lòng chuyển khoản đúng số tiền và nội dung để được xử lý nhanh chóng
                  </Text>
                  <Text style={styles.noteText}>
                    • Đơn hàng sẽ được xác nhận sau khi nhận được thanh toán
                  </Text>
                  <Text style={styles.noteText}>
                    • Liên hệ hotline nếu có vấn đề về thanh toán
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.confirmButton, processing && styles.confirmButtonDisabled]}
                  onPress={handleConfirmBankTransfer}
                  disabled={processing}
                >
                  {processing ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.confirmButtonText}>Xác nhận đã chuyển khoản</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setStep(1)}
                  disabled={processing}
                >
                  <Text style={styles.backButtonText}>← Quay lại</Text>
                </TouchableOpacity>
              </View>
            )}

            {processing && step === 1 && (
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.processingText}>Đang xử lý...</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
  },
  modalBody: {
    padding: 20,
  },
  orderInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  orderInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderInfoLabel: {
    fontSize: 14,
    color: '#666',
  },
  orderInfoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  orderInfoTotal: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  methodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodIconText: {
    fontSize: 24,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  methodDesc: {
    fontSize: 13,
    color: '#666',
  },
  methodArrow: {
    fontSize: 24,
    color: '#007AFF',
  },
  bankInfoCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  bankInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  bankInfoItem: {
    marginBottom: 15,
  },
  bankInfoLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  bankInfoValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  bankInfoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  amountText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  copyIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  noteCard: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    color: '#856404',
    marginBottom: 5,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default PaymentModal;
