import { NextResponse } from 'next/server';
import db from '@repo/db/client';
import axios from 'axios';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const isFounder = searchParams.get('isFounder') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    const chat = await db.chat.findFirst({
      where: {
        companyId: isFounder ? parseInt(userId) : null,
        investorId: isFounder ? null : parseInt(userId),
        type: 'chatbot',
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 100
        }
      }
    });

    if (!chat) {
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({ messages: chat.messages });
  } catch (error) {
    console.error('Chatbot history fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { message, userId, isFounder } = await req.json();

    if (!userId || !message) {
      return NextResponse.json({ error: 'UserId and message are required' }, { status: 400 });
    }

    console.log('message, userId, isFounder:', message, userId, isFounder);

    // Find or create a chat for the user and chatbot
    let chat = await db.chat.findFirst({
      where: {
        companyId: isFounder ? parseInt(userId) : null,
        investorId: isFounder ? null : parseInt(userId),
        type: 'chatbot',
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 100
        }
      }
    });

    if (!chat) {
      chat = await db.chat.create({
        data: {
          companyId: isFounder ? parseInt(userId) : null,
          investorId: isFounder ? null : parseInt(userId),
          pitchId: null,
          type: 'chatbot',
        },
        include: {
          messages: true
        }
      });
    }

    // Save user message
    const userMessage = await db.message.create({
      data: {
        content: message,
        SenderId: parseInt(userId),
        SenderType: isFounder ? 'founder' : 'investor',
        role: 'user',
        chatId: chat.id
      }
    });

    // Call Vultr API
    const vultrResponse = await axios.post(
      "https://api.vultrinference.com/v1/chat/completions/RAG",
      {
        collection: "venturelink",
        model: "llama2-13b-chat-Q5_K_M",
        messages: [{ role: "user", content: message }],
        max_tokens: 512,
        temperature: 0.8,
        top_k: 40,
        top_p: 0.9
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.VULTR_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Save chatbot response
    const botMessage = await db.message.create({
      data: {
        content: vultrResponse.data.choices[0].message.content,
        SenderId: null,
        SenderType: 'assistant',
        role: 'assistant',
        chatId: chat.id
      }
    });

    return NextResponse.json({ userMessage, botMessage });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}