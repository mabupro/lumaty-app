import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 全てのニュース取得
export const GET = async () => {
	try {
		const news = await prisma.news.findMany()
		return NextResponse.json({ message: 'Success', news }, { status: 200 })
	} catch (error) {
		// error が Error 型かチェック
		if (error instanceof Error) {
			console.error('Error fetching news:', error.message)
			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
		}
		// unknown 型のエラーが発生した場合
		console.error('Unknown error fetching news:', error)
		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
	}
}

// 新しいニュース追加
// export const POST = async (req: Request) => {
// 	try {
// 		const { festival_id, importance, posted_date, title, content } = await req.json()

// 		// バリデーションチェック
// 		if (!festival_id || !importance || !posted_date || !title || !content) {
// 			return NextResponse.json({ message: 'Required fields are missing' }, { status: 400 })
// 		}

// 		const newNews = await prisma.news.create({
// 			data: {
// 				festival_id,
// 				importance,
// 				posted_date,
// 				title,
// 				content,
// 			},
// 		})

// 		return NextResponse.json({ message: 'Success', newNews }, { status: 201 })
// 	} catch (error) {
// 		// error が Error 型かチェック
// 		if (error instanceof Error) {
// 			console.error('Error creating news:', error.message)
// 			return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 })
// 		}
// 		// unknown 型のエラーが発生した場合
// 		console.error('Unknown error creating news:', error)
// 		return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
// 	}
// }
