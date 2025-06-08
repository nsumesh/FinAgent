import React from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

import config from './FinAgentBotConfig';
import MessageParser from './FinAgentMessageParser';
import ActionProvider from './FinAgentActionProvider';

export default function FinAgentChat({ user }) {
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 999 }}>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
}