import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 全てのニュース
export const GET = async () => {
	try {
		const news = await prisma.news.findMany()
		return NextResponse.json({ message: 'Success', news }, { status: 200 })
	} catch (error) {
		console.error('Error fetching festivals:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	}
}

// 新しいニュース追加
export const POST = async (req: NextResponse) => {
	try {
		const { festival_id, importance, posted_date, title, content, festival } = await req.json()

		const newNews = await prisma.news.create({
			data: {
				festival_id,
				importance,
				posted_date,
				title,
				content,
				festival,
			},
		})
		return NextResponse.json({ message: 'Success', newNews }, { status: 201 })
	} catch (error) {
		console.error('Error creating festival:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	}
}
