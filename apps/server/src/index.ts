import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import db from "@repo/db/client";

interface Chat{
  id: number;
  createdAt: Date;
  updatedAt: Date;
  companyId: number;
  investorId: number;
  pitchId: number;
  messages: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    chatId: number;
    content: string;
    SenderId: number;
    SenderType: string;
  }[];
}

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('joinChat', async ({ companyId , isFounder , investorId }) => {

    console.log(
      `trying to join chat with data : ` , {
        companyId,
        isFounder,
        investorId
      }
    );

    try {
      let chat : Chat | null;

      chat = await db.chat.findFirst({
        where: {
          companyId: parseInt(companyId),
          investorId: parseInt(investorId),
          ...(companyId && {
            pitch: { companyId: parseInt(companyId) }
          })
        },
        include: {
          pitch: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 100
          }
        }
      });

      if (!chat && companyId) {
        // Create new chat for founder
        console.log('could not find any prev chat so creating a new chat with companyId : ', companyId);
        console.log('companyId , investorId : ' , companyId , investorId);


        const pitch = await db.pitch.findFirst({
          where: {
            companyId: parseInt(companyId),
            investorid: parseInt(investorId),
            status: 'Accepted'
          }
        });

        if (!pitch) {
          console.log('could not find any prev pitch with the given credentials');
          throw new Error('No accepted pitch found');
        }

        chat = await db.chat.create({
          data: {
            companyId: parseInt(companyId),
            investorId: parseInt(investorId),
            pitchId: pitch.id
          },
          include: {
            messages: true,
            pitch: true
          }
        });
      }
      
      if (!chat) {
        throw new Error('Chat not found or could not be created');
      }

      // Join the room
      const roomId = `chat_${chat.id}`;
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);

      // Send initial messages
      socket.emit('chatJoined', {
        chatId: chat.id,
        messages: chat.messages.reverse()
      });

    } catch (error) {
      console.error('Error in joinChat:', error);
      socket.emit('error', { 
        type: 'JOIN_ERROR',
        message: error instanceof Error ? error.message : 'Failed to join chat'
      });
    }
  });

  socket.on('sendMessage', async (data: {
    chatId: number;
    senderId: string;
    content: string;
    senderType: 'founder' | 'investor';
  }, callback) => {
    try {
      // Validate chat exists
      const chat = await db.chat.findUnique({
        where: { id: data.chatId }
      });

      if (!chat) {
        throw new Error('Chat not found');
      }

      // Create message
      const message = await db.message.create({
        data: {
          content: data.content,
          SenderId: parseInt(data.senderId),
          SenderType: data.senderType,
          chatId: data.chatId
        }
      });

      // Broadcast to room
      const roomId = `chat_${data.chatId}`;
      io.to(roomId).emit('newMessage', message);
      
      // Acknowledge success
      callback({ success: true, message });

    } catch (error) {
      console.error('Error in sendMessage:', error);
      callback({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send message'
      });
    }
  });

  socket.on('leaveChat', (chatId: number) => {
    const roomId = `chat_${chatId}`;
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.CHAT_SERVER_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Chat Server running on port ${PORT}`);
});