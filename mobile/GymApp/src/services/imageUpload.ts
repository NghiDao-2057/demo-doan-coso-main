import apiService from './api';

class ImageUploadService {
  async uploadAvatar(imageUri: string): Promise<string> {
    try {
      const formData = new FormData();
      
      // Tạo file object từ URI
      const filename = imageUri.split('/').pop() || 'avatar.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      // Upload lên backend endpoint /images/upload
      const response = await apiService.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.url;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new Error('Không thể tải ảnh lên. Vui lòng thử lại.');
    }
  }

  async updateUserAvatar(userId: string, avatarUrl: string): Promise<void> {
    try {
      await apiService.put(`/users/${userId}`, {
        avatar: avatarUrl,
      });
    } catch (error) {
      console.error('Error updating user avatar:', error);
      throw new Error('Không thể cập nhật ảnh đại diện.');
    }
  }
}

export default new ImageUploadService();
