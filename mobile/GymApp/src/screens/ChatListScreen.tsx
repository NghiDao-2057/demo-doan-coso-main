import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    username: string;
    fullName: string;
    avatar?: { url: string };
    role: string;
  }>;
  lastMessage?: {
    _id: string;
    content: string;
    createdAt: string;
    sender: {
      _id: string;
      username: string;
    };
  };
  lastMessageTime: string;
  unreadCount: number;
}

const ChatListScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [supportStaff, setSupportStaff] = useState<any[]>([]);

  useEffect(() => {
    fetchConversations();
    fetchSupportStaff();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/chat/conversations');
      const data = response as any;
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchSupportStaff = async () => {
    try {
      const response = await apiService.get('/chat/support-staff');
      const data = response as any;
      setSupportStaff(data.supportStaff || []);
    } catch (error) {
      console.error('Error fetching support staff:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const startSupportChat = async () => {
    if (supportStaff.length === 0) return;

    try {
      const response = await apiService.post('/chat/conversations', {
        participantIds: [supportStaff[0]._id],
        type: 'support',
      });
      const data = response as any;
      navigation.navigate('ChatDetail', { conversationId: data.conversation._id });
    } catch (error) {
      console.error('Error starting support chat:', error);
    }
  };

  const getOtherParticipant = (conv: Conversation) => {
    const userId = (user as any)?._id || (user as any)?.id;
    return conv.participants.find((p) => p._id !== userId);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins}p`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const otherUser = getOtherParticipant(item);
    if (!otherUser) return null;

    const lastMsg = item.lastMessage;
    const isOwnMessage = lastMsg?.sender._id === ((user as any)?._id || (user as any)?.id);

    return (
      <TouchableOpacity
        style={[
          styles.conversationCard,
          item.unreadCount > 0 && styles.conversationCardUnread,
        ]}
        onPress={() => navigation.navigate('ChatDetail', { conversationId: item._id })}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          {otherUser.avatar?.url ? (
            <Image source={{ uri: otherUser.avatar.url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {otherUser.fullName?.[0] || otherUser.username[0].toUpperCase()}
              </Text>
            </View>
          )}
          {otherUser.role !== 'user' && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {otherUser.role === 'admin' ? '👑' : '💪'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationName} numberOfLines={1}>
              {otherUser.fullName || otherUser.username}
            </Text>
            <Text style={styles.conversationTime}>
              {formatTime(item.lastMessageTime)}
            </Text>
          </View>

          <View style={styles.messagePreviewContainer}>
            <Text style={styles.messagePreview} numberOfLines={1}>
              {isOwnMessage && 'Bạn: '}
              {lastMsg?.content || 'Bắt đầu trò chuyện'}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = getOtherParticipant(conv);
    if (!otherUser) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      otherUser.fullName?.toLowerCase().includes(searchLower) ||
      otherUser.username.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ec4899" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#581c87', '#1e40af', '#047857']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tin nhắn</Text>
        <TouchableOpacity onPress={startSupportChat} style={styles.newChatButton}>
          <Text style={styles.newChatButtonText}>💬 Hỗ trợ</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào</Text>
            <TouchableOpacity
              style={styles.startChatButton}
              onPress={startSupportChat}
            >
              <Text style={styles.startChatButtonText}>Bắt đầu chat với hỗ trợ</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 28,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  newChatButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  newChatButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  searchContainer: {
    backgroundColor: '#1e1b4b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    padding: 0,
  },
  listContent: {
    paddingVertical: 10,
  },
  conversationCard: {
    backgroundColor: '#1e1b4b',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  conversationCardUnread: {
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    borderLeftWidth: 3,
    borderLeftColor: '#ec4899',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    backgroundColor: '#ec4899',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  roleBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1e1b4b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1e1b4b',
  },
  roleBadgeText: {
    fontSize: 10,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    marginRight: 10,
  },
  conversationTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messagePreview: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyContainer: {
    paddingVertical: 100,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 20,
  },
  startChatButton: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  startChatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ChatListScreen;
