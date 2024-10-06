import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'

// プログラム取得
export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url)
		// URLパスからfestivalIdを取得
		const festivalId = Number(url.pathname.split('/api/program/')[1])

		if (Number.isNaN(festivalId)) {
			return NextResponse.json({ message: 'Invalid festival ID' }, { status: 400 })
		}

		// プログラムを開始時間順に取得
		const programs = await prisma.program.findMany({
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

// プログラム更新
// export const PUT = async (req: Request) => {
// 	try {
// 		const url = new URL(req.url)
// 		const id = Number(url.pathname.split('/program/')[1])

// 		const { name, location_id, start_time, end_time, description } = await req.json()

// 		const updatedProgram = await prisma.program.update({
// 			where: { id },
// 			data: {
// 				name,
// 				location_id, // nullでもOK
// 				start_time,
// 				end_time,
// 				description,
// 			},
// 		})

// 		return NextResponse.json({ message: 'Success', updatedProgram }, { status: 200 })
// 	} catch (error) {
// 		console.error('Error updating program:', error)
// 		return NextResponse.json({ message: 'Error', error }, { status: 500 })
// 	} finally {
// 		await prisma.$disconnect()
// 	}
// }
