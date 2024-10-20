import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { ZodError } from 'zod' 
import { newsSchema } from '@/types/validate'

// 全てのニュース取得
export const GET = async () => {
	try {
		const news = await prisma.news.findMany()
		return NextResponse.json({ message: 'Success', news }, { status: 200 })
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}

// 新しいニュース追加
export const POST = async (req: Request) => {
	try {
		const body = await req.json()

		// Zodでバリデーション
		const validatedNews = newsSchema.parse(body)

		// ニュースデータを作成
		const newNews = await prisma.news.create({
			data: {
				festival_id: validatedNews.festival_id,
				importance: validatedNews.importance,
				posted_date: new Date(validatedNews.posted_date), // 日付をDate型に変換
				title: validatedNews.title,
				content: validatedNews.content,
			},
		})

		return NextResponse.json({ message: 'Success', newNews }, { status: 201 })
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{ message: 'Validation Error', error: error.errors },
				{ status: 400 },
			)
		}
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: 'Error creating news', error: error.message },
				{ status: 500 },
			)
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
