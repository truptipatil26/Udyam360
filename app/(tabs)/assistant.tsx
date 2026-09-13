import React, { useEffect, useState } from 'react';import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { sendMessageToN8N } from '../../src/services/n8nChat';
import { getUser, getProfile } from '../../src/services/auth';
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

export default function AssistantScreen() {
    const [userName, setUserName] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [capital, setCapital] = useState('');
  const [skills, setSkills] = useState('');

    useEffect(() => {
    const loadUserProfile = async () => {
      const user = await getUser();
      const profile = await getProfile();

      if (user) {
  setUserName(user.name);

  setMessages([
    {
      id: 'welcome',
      text: `Hi ${user.name.split(' ')[0]}! 👋 I'm U360AI, your AI Business Advisor. I can help you find business opportunities, understand market demand, analyze competition, and plan your business.`,
      sender: 'ai',
    },
  ]);
}

      if (profile) {
        setVillage(profile.village);
        setDistrict(profile.district);
        setState(profile.state);
        setCapital(profile.capital);
        setSkills(profile.skills);
      }
    };

    loadUserProfile();
  }, []);
  
  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [sessionId] = useState(
    () =>
      `udyam360-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}`
  );

  const sendMessage = async () => {
  const text = input.trim();

  if (!text || loading) {
    return;
  }

  const userMessage: Message = {
    id: Date.now().toString(),
    text,
    sender: 'user',
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput('');
  setLoading(true);

  try {
    const userContext = `
User name: ${userName}
Location: ${village}, ${district}, ${state}
Available capital: ₹${capital || '0'}
Skills/resources: ${skills || 'Not provided'}
`;

const messageWithContext = `
${userContext}

User's question:
${text}
`;

const response = await sendMessageToN8N(
  messageWithContext,
  sessionId
);
    

    const responseText = await response.text();

    console.log('n8n response:', responseText);

    // n8n streaming response contains multiple JSON objects
    // separated by new lines.
    const lines = responseText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    let aiText = '';

    for (const line of lines) {
      try {
        const data = JSON.parse(line);

        if (data.type === 'item' && data.content) {
          aiText += data.content;
        }
      } catch (error) {
        console.log('Could not parse line:', line);
      }
    }

    // Fallback if the response format changes
    if (!aiText) {
      aiText = responseText;
    }

    const aiMessage: Message = {
      id: `${Date.now()}-ai`,
      text: aiText,
      sender: 'ai',
    };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    console.error('n8n error:', error);

    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-error`,
        text: 'Sorry, I could not connect to the AI assistant. Please try again.',
        sender: 'ai',
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';

    return (
      <View
        style={[
          styles.messageRow,
          isUser
            ? styles.userRow
            : styles.aiRow,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser
              ? styles.userBubble
              : styles.aiBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser
                ? styles.userText
                : styles.aiText,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      {/* Header */}

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            U360AI
          </Text>

          <Text style={styles.subtitle}>
            Your AI Business Advisor • {village}, {district}
          </Text>
        </View>

        <View style={styles.onlineDot} />
      </View>

      {/* Messages */}

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          styles.messagesContainer
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Loading */}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
          <Text style={styles.loadingText}>
            U360AI is thinking...
          </Text>
        </View>
      )}

      {/* Input */}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your business..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!input.trim() || loading) &&
              styles.sendButtonDisabled,
          ]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendText}>
            ➤
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F7',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#183B2A',
  },

  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: '#777',
  },

  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#35A66F',
  },

  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },

  messageRow: {
    marginBottom: 12,
    flexDirection: 'row',
  },

  userRow: {
    justifyContent: 'flex-end',
  },

  aiRow: {
    justifyContent: 'flex-start',
  },

  messageBubble: {
    maxWidth: '82%',
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 18,
  },

  userBubble: {
    backgroundColor: '#2E7D5B',
    borderBottomRightRadius: 5,
  },

  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },

  userText: {
    color: '#FFFFFF',
  },

  aiText: {
    color: '#222',
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  loadingText: {
    marginLeft: 8,
    color: '#777',
    fontSize: 13,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 100,
    backgroundColor: '#F2F4F3',
    borderRadius: 23,
    paddingHorizontal: 17,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222',
  },

  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2E7D5B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },

  sendText: {
    color: '#FFFFFF',
    fontSize: 21,
  },
});