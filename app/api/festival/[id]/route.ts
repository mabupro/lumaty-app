import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 祭り、1件ずつ取得用
export const GET = async (req: Request, res: NextResponse) => {
	try {
		const id: number = Number.parseInt(req.url.split('/festival/')[1])
		const festival = await prisma.festival.findFirst({ where: { id } })
		return NextResponse.json({ message: 'Success', festival }, { status: 200 })
	} catch (error) {
		console.error('Error fetching festivals:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	}
}

// 祭り、編集用
export const PUT = async (req: Request) => {
	try {
		const id: number = Number.parseInt(req.url.split('/festival/')[1])
		const {
			name,
			country,
			prefecture,
			city_town,
			representative,
			overview,
			history,
			start_date,
			end_date,
			locations,
			news,
			images,
		} = await req.json()

		// Festival データを作成する
		const festival = await prisma.festival.update({
			data: {
				name,
				country,
				prefecture,
				city_town,
				representative,
				overview,
				history,
				start_date,
				end_date,
				// リレーションのデータはネストして作成
				locations: {
					create: locations, // 例: locationsが[{...}, {...}]の形式であること
				},
				news: {
					create: news,
				},
				images: {
					create: images,
				},
			},
			where: { id },
		})
		return NextResponse.json({ message: 'Success', festival }, { status: 201 })
	} catch (error) {
		console.error('Error creating festival:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	}
}
