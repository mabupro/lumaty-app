import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { z } from 'zod'

// Zodを使ったバリデーションスキーマ
const programSchema = z.object({
	name: z.string(),
	location_id: z.number().optional(),
	start_time: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
		message: 'Invalid start_time format',
	}),
	end_time: z
		.string()
		.optional()
		.refine((date) => !date || !Number.isNaN(Date.parse(date)), {
			message: 'Invalid end_time format',
		}),
	description: z.string().optional(),
})

// プログラム取得
export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/api/program/')[1])

		if (Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid program ID' }, { status: 400 })
		}

		const program = await prisma.program.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				start_time: true,
				end_time: true,
				description: true,
				location: {
					select: {
						id: true,
						name: true,
						latitude: true,
						longitude: true,
					},
				},
			},
		})

		if (!program) {
			return NextResponse.json({ message: 'Program not found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Success', program }, { status: 200 })
	} catch (error) {
		console.error('Error fetching program:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

// プログラム更新用 PUT メソッド
export const PUT = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/program/')[1])

		if (Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid program ID' }, { status: 400 })
		}

		const body = await req.json()

		// バリデーションチェック
		const result = programSchema.safeParse(body)
		if (!result.success) {
			return NextResponse.json(
				{ message: 'Validation error', errors: result.error.errors },
				{ status: 400 },
			)
		}

		const { name, location_id, start_time, end_time, description } = result.data

		const updatedProgram = await prisma.program.update({
			where: { id },
			data: {
				name,
				location_id: location_id || null,
				start_time: new Date(start_time),
				end_time: end_time ? new Date(end_time) : null,
				description,
			},
		})

		return NextResponse.json({ message: 'Success', updatedProgram }, { status: 200 })
	} catch (error) {
		console.error('Error updating program:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}

// プログラム削除用 DELETE メソッド
export const DELETE = async (req: Request) => {
	try {
		const url = new URL(req.url)
		const id = Number(url.pathname.split('/program/')[1])

		if (Number.isNaN(id)) {
			return NextResponse.json({ message: 'Invalid program ID' }, { status: 400 })
		}

		const deletedProgram = await prisma.program.delete({
			where: { id },
		})

		return NextResponse.json(
			{ message: 'Program deleted successfully', deletedProgram },
			{ status: 200 },
		)
	} catch (error) {
		console.error('Error deleting program:', error)
		return NextResponse.json({ message: 'Error', error }, { status: 500 })
	} finally {
		await prisma.$disconnect()
	}
}
