import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
