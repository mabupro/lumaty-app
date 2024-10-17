import { NextResponse } from 'next/server'
import prisma from '@/prisma/prismaClient'
import { z } from 'zod'

// Zodを使ったバリデーションスキーマ
const programSchema = z.object({
	festival_id: z.number(),
	name: z.string(),
	location_id: z.number().optional(), // 場所がない場合もあるため、optional
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
		const body = await req.json()

		// バリデーションチェック
		const result = programSchema.safeParse(body)
		if (!result.success) {
			return NextResponse.json(
				{ message: 'Validation error', errors: result.error.errors },
				{ status: 400 },
			)
		}

		const { festival_id, name, location_id, start_time, end_time, description } = result.data

		const newProgram = await prisma.program.create({
			data: {
				festival_id,
				name,
				location_id: location_id || null, // 場所がない場合はnullを設定
				start_time: new Date(start_time),
				end_time: end_time ? new Date(end_time) : null,
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
