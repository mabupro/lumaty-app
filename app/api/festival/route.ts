import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 祭り全て取得用
export const GET = async () => {
	try {
		const festivals = await prisma.festival.findMany({
			include: {
				locations: true, 
				news: true, 
				images: true, 
				// programs: true, 
			},
		})
		return NextResponse.json({ message: 'Success', festivals }, { status: 200 })
	} catch (error) {
		console.error('Error fetching festivals:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

// 祭り投稿用
export const POST = async (req: Request) => {
	try {
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
			programs,
		} = await req.json()

		// Festival データを作成する
		const festival = await prisma.festival.create({
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
				locations: {
					create: locations,
				},
				news: {
					create: news,
				},
				images: {
					create: images,
				},
				programs: {
					create: programs,
				},
			},
		})
		return NextResponse.json({ message: 'Success', festival }, { status: 201 })
	} catch (error) {
		console.error('Error creating festival:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	}finally {
		await prisma.$disconnect()
	}
}
