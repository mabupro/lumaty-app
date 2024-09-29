import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 祭りごとに取得用
export const GET = async (req: Request, res: NextResponse) => {
	try {
		const url = new URL(req.url)
		const festival_id = Number(url.pathname.split('/news/')[1])

		const news = await prisma.news.findMany({ where: { festival_id } })
		if (news.length === 0) {
			return NextResponse.json({ message: 'News not found' }, { status: 404 })
		}
		return NextResponse.json({ message: 'Success', news }, { status: 200 })
	} catch (error) {
		console.error('Error fetching festivals:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	}
}

// ニュース、編集用
export const PUT = async (req: Request, res: NextResponse) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/news/')[1])

		const { importance, posted_date, title, content } = await req.json()

		// news データを作成する
		const news = await prisma.news.update({
			data: {
				importance,
				posted_date,
				title,
				content,
			},
			where: { id },
		})
		return NextResponse.json({ message: 'Success', news }, { status: 200 })
	} catch (error) {
		console.error('Error creating festival:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	}
}
