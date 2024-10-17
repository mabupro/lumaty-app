import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { z } from 'zod'

// Zodを使ったバリデーションスキーマ
const newsSchema = z.object({
	festival_id: z.number(),
	importance: z.string(),
	posted_date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
		message: 'Invalid posted_date format',
	}),
	title: z.string(),
	content: z.string(),
})

// 全てのニュース取得
export const GET = async () => {
	try {
		const news = await prisma.news.findMany()
		return NextResponse.json({ message: 'Success', news }, { status: 200 })
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error fetching news:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		console.error('Unknown error fetching news:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}

// 新しいニュース追加
export const POST = async (req: Request) => {
	try {
		const body = await req.json()

		// バリデーションチェック
		const result = newsSchema.safeParse(body)
		if (!result.success) {
			return NextResponse.json(
				{ message: 'Validation error', errors: result.error.errors },
				{ status: 400 },
			)
		}

		const { festival_id, importance, posted_date, title, content } = result.data

		const newNews = await prisma.news.create({
			data: {
				festival_id,
				importance,
				posted_date: new Date(posted_date), // 日付のフォーマット変換
				title,
				content,
			},
		})

		return NextResponse.json({ message: 'Success', newNews }, { status: 201 })
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error creating news:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		console.error('Unknown error creating news:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
