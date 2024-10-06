import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'

// プログラム取得
export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const festivalId = Number(url.pathname.split('/api/program/')[1])

		if (Number.isNaN(festivalId)) {
			return NextResponse.json({ message: 'Invalid festival ID' }, { status: 400 })
		}

		const programs = await prisma.program.findMany({
			// 型を明示
			where: { festival_id: festivalId },
			include: { location: true },
		})

		return NextResponse.json({ message: 'Success', programs }, { status: 200 })
	} catch (error) {
		console.error('Error fetching programs:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

// 祭り、編集用
// export const PUT = async (req: Request) => {
// 	try {
// 		const url = new URL(req.url)
// 		const id = Number(url.pathname.split('/festival/')[1])
// 		const {
// 			name,
// 			country,
// 			prefecture,
// 			city_town,
// 			representative,
// 			overview,
// 			history,
// 			start_date,
// 			end_date,
// 			locations,
// 			news,
// 			images,
// 		} = await req.json()

// 		// Festival データを作成する
// 		const festival = await prisma.festival.update({
// 			data: {
// 				name,
// 				country,
// 				prefecture,
// 				city_town,
// 				representative,
// 				overview,
// 				history,
// 				start_date: start_date ? new Date(start_date) : null,
// 				end_date: end_date ? new Date(end_date) : null,
// 				// リレーションのデータはネストして作成
// 				locations: {
// 					create: locations, // 例: locationsが[{...}, {...}]の形式であること
// 				},
// 				news: {
// 					create: news,
// 				},
// 				images: {
// 					create: images,
// 				},
// 			},
// 			where: { id },
// 		})
// 		return NextResponse.json({ message: 'Success', festival }, { status: 200 })
// 	} catch (error) {
// 		console.error('Error creating festival:', error)
// 		return NextResponse.json({ message: 'Error', error }, { status: 500 })
// 	} finally {
// 		await prisma.$disconnect()
// 	}
// }
