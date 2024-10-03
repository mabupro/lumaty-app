import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// プログラム取得
export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/program/')[1])

		const program = await prisma.program.findUnique({
			where: { id },
			include: {
				location: true, // 関連する場所を含む
				festival: true, // 関連する祭りを含む
			},
		})

		if (!program) {
			return NextResponse.json({ message: 'Program not found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Success', program }, { status: 200 })
	} catch (error) {
		console.error('Error fetching program:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	}
}

// プログラム更新
export const PUT = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/program/')[1])

		const { name, location_id, start_time, end_time, description } = await req.json()

		const updatedProgram = await prisma.program.update({
			where: { id },
			data: {
				name,
				location_id, // nullでもOK
				start_time,
				end_time,
				description,
			},
		})

		return NextResponse.json({ message: 'Success', updatedProgram }, { status: 200 })
	} catch (error) {
		console.error('Error updating program:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	}
}
