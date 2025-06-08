import { supabase } from '../lib/supabaseClient';

export default class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;

    // Load user once
    this.user = null;
    this.loadUser();
  }

  async loadUser() {
    const { data } = await supabase.auth.getUser();
    this.user = data?.user || null;
    console.log('Loaded user in ActionProvider:', this.user);
  }

  async handleUserMessage(message) {
    try {
      const res = await fetch('http://localhost:5001/api/chat-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: this.user?.id,
          message: message,
        }),
      });

      const data = await res.json();
      const reply = data.reply || 'Sorry, no reply.';

      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, this.createChatBotMessage(reply)],
      }));
    } catch (err) {
      console.error('Chat agent error:', err);
    }
  }
}
