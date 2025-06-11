import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  initialMessages: [createChatBotMessage("Hi! I'm your financial portfolio assistant. Ask me about your portfolio!")],
  botName: 'FinAgent',
  headerText: 'FinAgent Assistant',
  customStyles: {
    botMessageBox: {
      backgroundColor: '#2563eb',
    },
    chatButton: {
      backgroundColor: '#2563eb',
    },
  },
};

export default config;
