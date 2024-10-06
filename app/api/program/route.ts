import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// プログラムを全て取得
export const GET = async () => {
	try {
		const programs = await prisma.program.findMany({
			include: {
				location: true, // 関連する場所を含む
				festival: true, // 関連する祭りを含む
			},
		})
		return NextResponse.json({ message: 'Success', programs }, { status: 200 })
	} catch (error) {
		console.error('Error fetching programs:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

// 新しいプログラムを追加
export const POST = async (req: Request) => {
	try {
		const { festival_id, name, location_id, start_time, end_time, description } = await req.json()

		const newProgram = await prisma.program.create({
			data: {
				festival_id,
				name,
				location_id, // nullでもOK
				start_time,
				end_time,
				description,
			},
		})

		return NextResponse.json({ message: 'Success', newProgram }, { status: 201 })
	} catch (error) {
		console.error('Error creating program:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
