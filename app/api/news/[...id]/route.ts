import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { ZodError } from 'zod'
import { newsSchema } from '@/types/validate'

// ニュース取得
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
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}

// ニュースの編集（更新）
export const PUT = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const paths = url.pathname.split('/news/')[1]?.split('/')
		const festival_id = Number(paths?.[0])
		const id = paths?.[1] ? Number(paths[1]) : undefined

		if (Number.isNaN(festival_id) || Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid festival or news ID' }, { status: 400 })
		}

		const body = await req.json()

		// Zodでバリデーション
		const validatedNews = newsSchema.parse(body)

		// ニュースの更新
		const updatedNews = await prisma.news.update({
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			where: { id: id!, festival_id },
			data: {
				importance: validatedNews.importance,
				posted_date: new Date(validatedNews.posted_date),
				title: validatedNews.title,
				content: validatedNews.content,
			},
		})

		return NextResponse.json({ message: 'Success', updatedNews }, { status: 200 })
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{ message: 'Validation Error', error: error.errors },
				{ status: 400 },
			)
		}
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: 'Error updating news', error: error.message },
				{ status: 500 },
			)
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}

// ニュースの削除
export const DELETE = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const paths = url.pathname.split('/news/')[1]?.split('/')
		const festival_id = Number(paths?.[0])
		const id = paths?.[1] ? Number(paths[1]) : undefined

		if (Number.isNaN(festival_id) || Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid festival or news ID' }, { status: 400 })
		}

		// ニュースの削除
		const deletedNews = await prisma.news.delete({
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			where: { id: id!, festival_id },
		})

		return NextResponse.json({ message: 'News deleted successfully', deletedNews }, { status: 200 })
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ message: 'Error deleting news', error: error.message },
				{ status: 500 },
			)
		}
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}
