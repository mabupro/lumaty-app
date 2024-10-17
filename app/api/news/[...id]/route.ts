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

// ニュース取得用 GET メソッド
export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const paths = url.pathname.split('/news/')[1]?.split('/')
		const festival_id = Number(paths?.[0])
		const id = paths?.[1] ? Number(paths[1]) : undefined

		// festival_idが有効な数値かチェック
		if (Number.isNaN(festival_id)) {
			return NextResponse.json({ message: 'Invalid festival ID' }, { status: 400 })
		}

		// ニュースIDが指定されている場合、特定のニュースを取得
		if (id !== undefined) {
			if (Number.isNaN(id)) {
				return NextResponse.json({ message: 'Invalid news ID' }, { status: 400 })
			}

			const news = await prisma.news.findFirst({
				where: { festival_id, id },
			})

			if (!news) {
				return NextResponse.json({ message: 'News not found' }, { status: 404 })
			}

			return NextResponse.json({ message: 'Success', news }, { status: 200 })
		}

		// ニュースIDが指定されていない場合、すべてのニュースを取得
		const news = await prisma.news.findMany({
			where: { festival_id },
		})

		if (news.length === 0) {
			return NextResponse.json({ message: 'No news found for this festival' }, { status: 404 })
		}

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

// ニュース更新用 PUT メソッド
export const PUT = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const paths = url.pathname.split('/news/')[1]?.split('/')
		const id = paths?.[1] ? Number(paths[1]) : undefined

		// idのバリデーション
		if (Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid news ID' }, { status: 400 })
		}

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

		// ニュースの更新処理
		const updatedNews = await prisma.news.update({
			where: { id },
			data: {
				festival_id,
				importance,
				posted_date: new Date(posted_date), // 日付の変換
				title,
				content,
			},
		})

		return NextResponse.json({ message: 'Success', updatedNews }, { status: 200 })
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error updating news:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		console.error('Unknown error updating news:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}

// ニュース削除用の DELETE メソッド
export const DELETE = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const paths = url.pathname.split('/news/')[1]?.split('/')
		const festival_id = Number(paths?.[0])
		const id = paths?.[1] ? Number(paths[1]) : undefined

		// festival_idとidのバリデーション
		if (Number.isNaN(festival_id) || Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid festival ID or news ID' }, { status: 400 })
		}

		// ニュースの削除処理
		const deletedNews = await prisma.news.delete({
			where: { id },
		})

		return NextResponse.json({ message: 'News deleted successfully', deletedNews }, { status: 200 })
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error deleting news:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		console.error('Unknown error deleting news:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}
