import { getChatResponse } from '../services/ai.js';

export function setupChatSocket(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on('chat:message', async (data) => {
      const { message, mode } = data;

      try {
        // Send typing indicator
        socket.emit('chat:typing', true);

        const response = await getChatResponse(message, mode);

        // Small delay for natural feeling
        setTimeout(() => {
          socket.emit('chat:typing', false);
          socket.emit('chat:response', {
            content: response,
            timestamp: new Date().toISOString(),
          });
        }, 500);
      } catch (error) {
        socket.emit('chat:typing', false);
        socket.emit('chat:error', { message: 'Failed to get AI response' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
}
