// apps/web/app/api/messages/route.ts
import { NextResponse } from 'next/server'
import db from '@repo/db/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const founderId = searchParams.get('founderId')
  const investorId = searchParams.get('investorId')

  if (!founderId || !investorId) {
    return NextResponse.json({ error: 'Missing founderId or investorId' }, { status: 400 })
  }

  const chatId = `${Math.min(parseInt(founderId), parseInt(investorId))}_${Math.max(parseInt(founderId), parseInt(investorId))}`

  try {
    const messages = await db.message.findMany({
      where: {
        chatId: parseInt(chatId)
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: 100
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}